<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="handlePostArticle">
            <fieldset>
              <fieldset class="form-group">
                <input v-model.trim="articleFormData.title" :disabled='isSubmitting' type="text" required class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input v-model.trim="articleFormData.description" :disabled='isSubmitting' type="text" required class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model.trim="articleFormData.body" :disabled='isSubmitting' class="form-control" required rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input @keydown.enter.prevent='handleTagInput' v-model.trim="tagInputValue" :disabled='isSubmitting' type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
                <div v-if="articleFormData.tagList && articleFormData.tagList.length" class="tag-list">
                  <span v-for="tagItem in articleFormData.tagList" :key='tagItem' class="tag-default tag-pill">
                    <i class="ion-close-round" @click="handleRemoveTag(tagItem)"></i>
                    {{tagItem}}
                  </span>
                </div>
              </fieldset>
              <button :disabled='isSubmitting' class="btn btn-lg pull-xs-right btn-primary">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {
  createArticle,
  getArticle,
  updateArticle,
} from '@/api/article'
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated',
  name: 'EditorIndex',
  scrollToTop: true,
  async asyncData ({params, store, redirect}) {
    const { slug } = params
    if (!slug) {
      return {}
    }
    try {
      const { data } = await getArticle(slug)
      const user = store.state.user
      const article = data.article
      //非自己创建的文章，不允许编辑，直接跳回首页
      if (user.username !== article.author.username){
        return redirect('/')
      }
      return {
        slug,
        articleFormData: {
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
        }
      }
    } catch {
      return redirect('/')
    }
  },
  data () {
    return {
      slug: null,
      tagInputValue: '',
      articleFormData: {
        title: '',
        description: '',
        body: '',
        tagList: [],
      },
      isSubmitting: false,
    }
  },
  methods: {
    handleTagInput () {
      if (!this.tagInputValue) {
        return
      }
      if (this.articleFormData.tagList.indexOf(this.tagInputValue) !== -1) {
        return
      }
      this.articleFormData.tagList.push(this.tagInputValue)
      this.tagInputValue = ''
    },
    handleRemoveTag (tagItem) {
      if (this.isSubmitting) {
        return
      }
      let index = this.articleFormData.tagList.indexOf(tagItem)
      index !== -1 && this.articleFormData.tagList.splice(index, 1)
    },
    async handlePostArticle () {
      this.isSubmitting = true
      try {
        const {data} = this.slug? 
          await updateArticle(this.slug, {
            article: this.articleFormData
          }) : 
          await createArticle({
            article: this.articleFormData
          })
        this.$router.push(`/article/${data.article.slug}`)
      } catch (err) {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style>

</style>
