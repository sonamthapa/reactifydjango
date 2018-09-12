// import React, { Component } from 'react';
// import 'whatwg-fetch'
// import cookies from 'react-cookies'

// class Posts extends Component {
//  loadPost(){
//    const endpoint ='/api/posts/'
//    let lookupOptions = {
//      method:'GET',
//      headers:{
//        'Content-type':'application/json'
//      }
//    }

//    fetch(endpoint, lookupOptions)
//    .then(function(response){
//      return response.json()

//    }).then(function(responseData){
//      console.log(responseData)
//    }).catch(function(error){
//      console.log("error".error)
//    })
//  }

//  createPost(){
//    const endpoint ='/api/posts/'
//    const crsfToken = cookies.load('csrftoken')
//    let data={
//      "slug":"",
//      "title":"",
//      "content":"",
//      "draft":false,
//      "publish":null
//    }
//    if (csrfToken !==undefined){
//      let lookupOptions= {
//        method:'POST',
//        headers:{
//          'Content-type':'application/json'
//          'X-CSRFToken':csrfToken
//      },
//      body:JSON.stringify(data),
//      credentials:'include'
//    }

//    fetch(endpoint, lookupOptions)
//    .then(function(response){
//      return response.json()

//    }).then(function(responseData){
//      console.log(responseData)
//    }).catch(function(error){
//      console.log("error".error)
//    })
//  }
// componentDidMount(){
//  this.loadPosts()
// }
//   render() {
//     return (
//       <h1>Hello World</h1>
//     );
//   }
// }

// export default Posts;
// code by Sonam
import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import PostInline from './PostInline'
import PostUpdate from './PostUpdate'
class Posts extends Component {
  constructor(props){
    super(props)
    this.togglePostListClass = this.togglePostListClass.bind(this)
    this.handleNewPost = this.handleNewPost.bind(this)
  }
  state = {
        posts: [],
        postListClass: 'card',
    }
  loadPosts () {
    const endpoint = '/api/posts/'
    let thisComp = this
    let lookupOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'applications/json'
      }
    }
    fetch(endpoint, lookupOptions)
      .then(function (response) {
        return response.json()
      }).then(function (responseData) {
        console.log(responseData)
        thisComp.setState({
          posts: responseData
        })
      }).catch(function (error) {
        console.log('error', error)
      })
  }
  handleNewPost(postItemData){
    console.log(postItemData)
    let currentPosts  = this.state.posts
    currentPosts.unshift(postItemData)
    this.setState({
      posts:currentPosts
    })

  }

  togglePostListClass(event){
    event.preventDeault()
    let currentListClass = this.state.PostListClass
    if(currentListClass===""){
      this.setState({
      postListClass: 'card',
    })
    }else{
      this.setState({
      postListClass: '',
    })

  }

}
    
  componentDidMount () {
    this.setState({
      posts: [],
      postListClass: 'card',
    })
    this.loadPosts()
  }
  render () {
    const { posts } = this.state
    const {postListClass} = this.state
    const csrfToken = cookie.load('csrftoken')
    return (
      <div>
          <h1>Hello World</h1>
          <button onClick={this.togglePostListClass}>Toggle Class</button>
          {posts.length > 0 ? posts.map((postItem,index)=>{
            return (
                <PostInline post={postItem} elclass={postListClass} />
            )
        }) : <p>No Posts Found</p>}
        {(csrfToken !==undefined && csrfToken !==null) ?
        <div className='my-5'>
          <PostUpdate newPostItemCreated={this.handleNewPost}/>
        </div>
        :""}

       </div>
      );
  }
}

export default Posts
