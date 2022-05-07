<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{profile.username}}</h4>
            <p>
              {{profile.bio}}
            </p>
            <button v-if="!isSelf" :disabled='isUpdatingFollow' @click='handleFollow' class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{profile.following? `Unfollow ` : `Follow `}}{{profile.username}}
            </button>
            <nuxt-link v-else class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact 
                  class="nav-link"
                  :to="`/profile/${username}`"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  exact
                  class="nav-link"
                  :to="{
                    path: `/profile/${username}`,
                    query: {
                      tab: 'favorited'
                    }
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>
          <template v-if="articles && articles.length">
            <div v-for="articleItem in articles" :key='articleItem.slug' class="article-preview">
              <div class="article-meta">
                <nuxt-link 
                  :to="{
                    name: 'profile',
                    params: {
                      username: articleItem.author.username
                    }
                  }"
                >
                  <img :src="articleItem.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    class="author"
                    :to="{
                    name: 'profile',
                    params: {
                      username: articleItem.author.username
                    }
                  }"
                  >
                    {{articleItem.author.username}}
                  </nuxt-link>
                  <span class="date">{{articleItem.createdAt | date('MMM DD, YYYY')}}</span>
                </div>
                <button 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: articleItem.favorited
                  }"
                  @click="handleFavorite(articleItem)"
                  :disabled="articleItem.favoriteDisabled"
                >
                  <i class="ion-heart"></i> {{articleItem.favoritesCount}}
                </button>
              </div>
              <nuxt-link
                class="preview-link"
                :to="{
                  name: 'article',
                  params: {
                    slug: articleItem.slug
                  }
                }"
              >
                <h1>{{articleItem.title}}</h1>
                <p>{{articleItem.body}}</p>
                <span>Read more...</span>
                <ul v-if="articleItem.tagList && articleItem.tagList.length" class="tag-list">
                  <li v-for="tagItem in articleItem.tagList" :key='tagItem' class="tag-default tag-pill tag-outline">{{tagItem}}</li>
                </ul>
              </nuxt-link>
            </div>
          </template>
          <div v-else class="article-preview">No articles are here... yet.</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { 
  getProfile,
  follow,
  unFollow,
} from '@/api/profile'
import { 
  getArticles,
  addFavorite,
  deleteFavorite,
} from '@/api/article'
export default {
  name: 'UserProfile',
  async asyncData ({ params, query }) {
    const { username } = params
    const { tab = 'self' } = query
    let articlesReq = {}
    if(tab === 'self'){
      articlesReq.author = username;
    } else {
      articlesReq.favorited = username;
    }
    const [profileRes, articleRes] = await Promise.all([
      getProfile(username),
      getArticles(articlesReq)
    ])
    const { profile } = profileRes.data
    const { articles = [] } = articleRes.data
    articles.forEach(item => { item.favoriteDisabled = false })
    return {
      username,
      profile,
      articles,
    }
  },
  data () {
    return {
      isUpdatingFollow: false,
    }
  },
  computed: {
    isSelf () {
      return this.$store.state.user && this.$store.state.user.username === this.profile.username
    }
  },
  watchQuery: ['tab'],
  methods: {
    async handleFollow () {
      if (!this.$store.state.user) {
        this.$router.push('/login')
        return
      }
      this.isUpdatingFollow = true;
      const isFollowed = this.profile.following
      try {
        const { data } = isFollowed?
          await unFollow(this.profile.username) :
          await follow(this.profile.username)
        this.profile = data.profile
      } finally {
        this.isUpdatingFollow = false;
      }  
    },
    async handleFavorite (article) {
      if (!this.$store.state.user) {
        this.$router.push('/login')
        return
      }
      article.favoriteDisabled = true
      try {
        if (article.favorited) {
          // 取消点赞
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount += -1
        } else {
          // 添加点赞
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        }
      } finally {
        article.favoriteDisabled = false
      }
    }
  }
}
</script>

<style>

</style>
