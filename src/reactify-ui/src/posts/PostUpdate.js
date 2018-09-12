import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import moment from 'moment'

class PostUpdate extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDraftChange = this.handleDraftChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.postTitleRef = React.createRef()

    this.state = {
      draft: false,
      title: null,
      content: null,
      publish: null
    }
  }
  createPosts (data) {
    const endpoint = '/api/posts/'
    const csrfToken = cookie.load('csrftoken')
    let thisComp = this
    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }

      fetch(endpoint, lookupOptions)
        .then(function (response) {
          return response.json()
        }).then(function (responseData) {
          console.log(responseData)
          if (thisComp.props.newPostItemCreated) {
            thisComp.props.newPostItemCreated(responseData)
          }
          thisComp.clearForm()
        }).catch(function (error) {
          console.log('error', error)
        })
    }
  }
  UpdatePost (data) {
    const { post } = this.props
    const endpoint = `/api/posts/${post.slug}/`
    const csrfToken = cookie.load('csrftoken')
    let thisComp = this
    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'applications/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }

      fetch(endpoint, lookupOptions)
        .then(function (response) {
          return response.json()
        }).then(function (responseData) {
          console.log(responseData)
          if (thisComp.props.postItemUpdated) {
            thisComp.props.newPostItemCreated(responseData)
          }
          thisComp.clearForm()
        }).catch(function (error) {
          console.log('error', error)
        })
    }
  }
  handleSubmit (event) {
    event.preventDefault()
    // onsole.log(this.state)
    let data = this.state
    const { post } = this.props
    if (post !== undefined) {
      this.UpdatePosts(data)
    } else {
      this.createPost(data)
    }
  }
  handleDraftChange (event) {
    this.setState({
      draft: !this.state.draft
    })
  }
  handleInputChange (event) {
    event.preventDefault()
    let key = event.target.name
    let value = event.target.value
    if (key === 'title') {
      if (value.length > 15) {
        alert('this title is too long')
      }
    }
    this.setState({
      [key]: value
    })
  }
  clearForm (event) {
    if (event) {
      event.preventDefault()
    }
    this.postCreateform.reset()
  }

  componentDidMount () {
    const { post } = this.props
    if (post !== undefined) {
      this.setState({
        draft: post.draft,
        title: post.title,
        content: post.content,
        publish: moment(post.publish).format('YYYY-MM-DD')

      })
    } else {
      this.setState({
        draft: false,
        title: null,
        content: null,
        publish: moment(new Date()).format('YYYY-MM-DD')
      })
    }

    this.postTitleRef.current.focus()
  }

  render () {
    const { publish } = this.state
    const { title } = this.state
    const { content } = this.state
    return (
      <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
        <div className='form-group'>
          <label for='title'>Post title</label>
          <input
            type='text'
            id='title'
            name='title'
            value={title}
            className='form-control'
            placeholder='Blog Post Title'
            ref={this.postTitleRef}
            onChange={this.handleInputChange}
            required='required' />
        </div>
        <div className='form-group'>
          <label for='content'>Content</label>
          <textarea
            id='content'
            ref={this.postContentRef}
            name='content'
            value={content}
            className='form-control'
            placeholder='Psost Content'
            onChange={this.handleInputChange}
            required='required' />
        </div>
        <div className='form-group'>
          <label for='draft'>
            <input type='checkbox'
              value={this.state.draft}
              checked='draft'
              name='draft'
              className='form-control'
              onChange={this.handleDraftChange} />
            Draft</label>
          <button onClick={(event) => { event.preventDefault(); this.handleDraftChange() }}>Toggle Draft </button>
        </div>
        <div className='form-group'>
          <label for='publish'>Publish Date</label>
          <input
            type='date'
            id='publish'
            name='publish'
            className='form-control'
            onChange={this.handleInputChange}
            value={publish}
            required='required' />
        </div>
        <button type='submit' className='btn btn-primary'>Save</button>
        <button className={`btn btn-secondary ${this.props.post === 'undefined' ? 'd-block' : 'd-none'}`}
          onClick={this.clearForm}>Cancel</button>
      </form>

    )
  }
}

export default PostUpdate
