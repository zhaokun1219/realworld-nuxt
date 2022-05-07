<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
      :disabled='isUpdatingFollow' 
      @click='handleFollow'
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{article.author.following? `Unfollow ` : `Follow `}}{{article.author.username}}
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      :disabled='isUpdatingFavorite' 
      @click='handleFavorite'
    >
      <i class="ion-heart"></i>
      &nbsp;
      {{article.favorited? 'Unfavorite': 'Favorite' }} Article <span class="counter">({{article.favoritesCount || 0}})</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    },
    isUpdatingFollow: {
      type: Boolean,
      default: false,
    },
    isUpdatingFavorite: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleFollow () {
      this.$emit('follow')
    },
    handleFavorite () {
      this.$emit('favorite')
    }
  }
}
</script>

<style>

</style>
