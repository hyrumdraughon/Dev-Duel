/* eslint-disable no-undef */
$('form').submit(() => {
  const username = $('form input').val()
  console.log(`examining ${username}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      console.log(`Got data for ${username}`)
      console.log(data)
      /*
        Attach the data returned to the DOM
        The data currently hard-coded into the DOM is placeholder data
       */
      $('.user-error').addClass('hide')
      
      $('.username').html(data.username)
      $('.full-name').html(data.name)
      $('.location').html(data.location)
      $('.email').html(data.username + '@blah.com')
      $('.bio').html(data.bio)
      $('.avatar').attr('src', data['avatar-url'])
      $('.titles').text(data.titles.join(', '))
      $('.favorite-language').html(data['favorite-language'])
      $('.total-stars').html(data['total-stars'])
      $('.most-starred').html(data['highest-starred'])
      $('.public-repos').html(data['public-repos'])
      $('.perfect-repos').html(data['perfect-repos'])
      $('.followers').html(data.followers)
      $('.following').html(data.following)

      $('.user-results').removeClass('hide') // Display '.user-results' element
    })
    .catch(err => {
      console.log(`Error getting data for ${username}`)
      console.log(err.message)
      /*
        If there is an error finding the user, instead toggle the display of the '.user-error' element
        and populate it's inner span '.error' element with an appropriate error message
      */
      $('.user-results').addClass('hide')
      $('.user-error').removeClass('hide')

      if (username.length === 0) {
        $('.user-error').html("Error: you must enter a username to inspect")
      } else if (typeof data === 'undefined') {
        $('.user-error').html(`Error: the username ${username} does not exist`)
      } else {
        $('.user-error').html(err.message)
      }
      
    })

  return false // return false to prevent default form submission
})
