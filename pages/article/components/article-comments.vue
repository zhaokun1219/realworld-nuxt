<template>
  <div>
    <form v-if="user" class="card comment-form">
      <div class="card-block">
        <textarea v-model="commentInputValue" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button type="button" :disabled='isQueryingComment || isPostingComment' @click='handlePostComment' class="btn btn-sm btn-primary">
        Post Comment
        </button>
      </div>
    </form>

    <div
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getComments,
  addComment,
} from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [], // 评论列表
      isQueryingComment: false,
      isPostingComment: false,
      commentInputValue: '',
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted () {
    this.queryComments()
  },
  
  methods: {
    async handlePostComment () {
      if (!this.commentInputValue) {
        return
      }
      this.isPostingComment = true;
      try {
        await addComment({
          slug: this.article.slug,
          comment: {
            body: this.commentInputValue
          }
        })
        this.queryComments()
      } finally {
        this.isPostingComment = false;
      }
    },
    async queryComments () {
      this.isQueryingComment = true
      try {
        const { data } = await getComments(this.article.slug)
        this.comments = data.comments
      } finally {
        this.isQueryingComment = false
      }  
    }
  }
}
</script>

<style>

</style>
