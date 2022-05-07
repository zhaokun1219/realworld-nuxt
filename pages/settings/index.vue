<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="userForm.image" :disabled='isSubmitting' class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="userForm.username" :disabled='isSubmitting' class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="userForm.bio" :disabled='isSubmitting' class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="userForm.email" :disabled='isSubmitting' class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="userForm.password" :disabled='isSubmitting' class="form-control form-control-lg" type="password" placeholder="New Password" minlength="8">
                </fieldset>
                <button :disabled='isSubmitting' @click='handleUpdate' type="button" class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr>
          <button @click="handleLogout" :disabled='isSubmitting' class="btn btn-outline-danger" >
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {updateUser} from '@/api/user'

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data () {
    const user = this.$store.state.user
    return {
      userForm: {
        image: user.image,
        username: user.username,
        bio: user.bio,
        email: user.email,
        password: undefined,
      },
      isSubmitting: false, //是否正在提交表单中，此期间应禁止编辑表单
    }
  },
  methods: {
    handleLogout () {
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      this.$router.push('/')
    },
    async handleUpdate () {
      this.isSubmitting = true
      let reqData = {
        ...this.userForm
      }
      //此处后端接口有bug，如果password为空字符串，必须从请求数据中移除password字段，否则会导致密码被设置为空，就再也登录不上了
      if (!reqData.password) {
        delete reqData.password
      }
      try {
        const {data} = await updateUser({
          user: reqData
        })
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)
        this.$router.push(`/profile/${data.user.username}`)
      } catch (err) {
        this.isSubmitting = false
        if (err.response && err.response.data) {
          const errors = err.response.data.errors
          let tipMes = ''
          Object.keys(errors).forEach(key => {
            tipMes += `${key} ${errors[key]} \n`
          })
          alert(tipMes)
        } else {
          alert('提交失败')
        }
      }
      
    }
  }
}
</script>

<style>

</style>
