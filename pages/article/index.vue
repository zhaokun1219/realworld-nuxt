<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <article-meta 
          :isSelfArticle='isSelfArticle'
          :article="article"
          :isUpdatingFollow='isUpdatingFollow'
          :isUpdatingFavorite='isUpdatingFavorite'
          :isDeletingArticle='isDeletingArticle'
          @follow='handleFollow'
          @favorite='handleFavorite' 
          @deleteArticle='handleDeleteArticle'
        />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta 
          :isSelfArticle='isSelfArticle'
          :article="article"
          :isUpdatingFollow='isUpdatingFollow'
          :isUpdatingFavorite='isUpdatingFavorite'
          :isDeletingArticle='isDeletingArticle'
          @follow='handleFollow'
          @favorite='handleFavorite' 
          @deleteArticle='handleDeleteArticle'
        />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <article-comments :article="article" />

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { 
  follow,
  unFollow,
} from '@/api/profile'
import { 
  getArticle,
  addFavorite,
  deleteFavorite,
  deleteArticle,
} from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'

export default {
  name: 'ArticleIndex',
  async asyncData ({ params, store }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article,
      isSelfArticle: Boolean(store.state.user && store.state.user.username === article.author.username) 
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description }
      ]
    }
  },
  data () {
    return {
      isUpdatingFollow: false,
      isUpdatingFavorite: false,
      isDeletingArticle: false,
    }
  },
  methods: {
    async handleFollow () {
      if (!this.$store.state.user) {
        this.$router.push('/login')
        return
      }
      this.isUpdatingFollow = true
      const author = this.article.author
      const isFollowed = author.following
      try {
        const { data } = isFollowed?
          await unFollow(author.username) :
          await follow(author.username)
        author.following = data.profile.following
      } finally {
        this.isUpdatingFollow = false
      }
    },
    async handleFavorite () {
      if (!this.$store.state.user) {
        this.$router.push('/login')
        return
      }
      this.isUpdatingFavorite = true
      const article = this.article
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
        this.isUpdatingFavorite = false
      }
    },
    async handleDeleteArticle () {
      this.isDeletingArticle = true
      try {
        await deleteArticle(this.article.slug)
        this.$router.push('/')
      } catch (err) {
        this.isDeletingArticle = false
      }
    }
  },
}
</script>

<style>

</style>
