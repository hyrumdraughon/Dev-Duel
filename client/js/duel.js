/* eslint-disable no-undef */
$('form').submit(() => {
  $('.duel-container').addClass('hide')
  $('.duel-error').addClass('hide')

  const usernameLeft = $('[name=username-left]').val()
  const usernameRight = $('[name=username-right]').val()
  console.log(`dueling ${usernameLeft} and ${usernameRight}`)

  /*
    Fetch 2 user's github data and display their profiles side by side
    If there is an error in finding user or both users, display appropriate error
    message stating which user(s) doesn't exist
  
    It is up to the student to choose how to determine a 'winner'
    and displaying their profile/stats comparison in a way that signifies who won.
   */

  fetch(`${USERS_URL}?username=${usernameLeft}&username=${usernameRight}`)
    .then(response => response.json())
    .then(data => {
      console.log(`Got data for ${usernameLeft} and ${usernameRight}`)
      console.log(data)

      $('.duel-error').addClass('hide')

      const leftData = data[0]
      const rightData = data[1]

      // Update HTML data for left user
      $('.left .username').html(leftData.username)
      $('.left .full-name').html(leftData.name)
      $('.left .location').html(leftData.location)
      $('.left .email').html(leftData.username + '@blah.com')
      $('.left .bio').html(leftData.bio)
      $('.left .avatar').attr('src', leftData['avatar-url'])
      $('.left .titles').text(leftData.titles.join(', '))
      $('.left .favorite-language').html(leftData['favorite-language'])
      $('.left .total-stars').html(leftData['total-stars'])
      $('.left .highest-starred').html(leftData['highest-starred'])
      $('.left .public-repos').html(leftData['public-repos'])
      $('.left .perfect-repos').html(leftData['perfect-repos'])
      $('.left .followers').html(leftData.followers)
      $('.left .following').html(leftData.following)

      // Update HTML data for right user
      $('.right .username').html(rightData.username)
      $('.right .full-name').html(rightData.name)
      $('.right .location').html(rightData.location)
      $('.right .email').html(rightData.username + '@blah.com')
      $('.right .bio').html(rightData.bio)
      $('.right .avatar').attr('src', rightData['avatar-url'])
      $('.right .titles').text(rightData.titles.join(', '))
      $('.right .favorite-language').html(rightData['favorite-language'])
      $('.right .total-stars').html(rightData['total-stars'])
      $('.right .highest-starred').html(rightData['highest-starred'])
      $('.right .public-repos').html(rightData['public-repos'])
      $('.right .perfect-repos').html(rightData['perfect-repos'])
      $('.right .followers').html(rightData.followers)
      $('.right .following').html(rightData.following)

      const winner = getWinner(leftData, rightData)
      $('#winnerAnnouncement').html(winner)

      $('.duel-container').removeClass('hide') // Display '.duel-container' elements
    })
    .catch(err => {
      console.log(`Error getting data for ${usernameLeft} and ${usernameRight}`)
      console.log(err)

      $('.duel-container').addClass('hide')
      $('.duel-error').removeClass('hide')

      let message = 'Error: '
      if (usernameLeft.length === 0 || usernameRight.length === 0) {
        message = message.concat('you must provide two usernames to duel; ')
      }

      if (typeof data === 'undefined' && usernameLeft !== 0 && usernameRight !== 0) {
        message = message.concat('one or both of the usernames do not exist')
      }

      if (message !== 'Error: ') {
        $('.error').html(message)
      } else {
        $('.error').html(err.message)
      }

    })

  return false // return false to prevent default form submission
})

const getWinner = (leftData, rightData) => {
  $('#winnerAnnouncement').removeClass('yellow')
  $('.duel-container .stat').removeClass('green red yellow')

  let leftScore = 0
  let rightScore = 0

  // Score and Color Total-Stars
  if (leftData['total-stars'] > rightData['total-stars']) {
    leftScore++
    $('#leftTotalStars').addClass('green')
    $('#rightTotalStars').addClass('red')
  } else if (leftData['total-stars'] < rightData['total-stars']) {
    rightScore++
    $('#leftTotalStars').addClass('red')
    $('#rightTotalStars').addClass('green')
  } else {
    $('#leftTotalStars').addClass('yellow')
    $('#rightTotalStars').addClass('yellow')
  }

  // Score and Color Highest-Starred
  if (leftData['highest-starred'] > rightData['highest-starred']) {
    leftScore++
    $('#leftHighestStarred').addClass('green')
    $('#rightHighestStarred').addClass('red')
  } else if (leftData['highest-starred'] < rightData['highest-starred']) {
    rightScore++
    $('#leftHighestStarred').addClass('red')
    $('#rightHighestStarred').addClass('green')
  } else {
    $('#leftHighestStarred').addClass('yellow')
    $('#rightHighestStarred').addClass('yellow')
  }

  // Score and Color Public-Repos
  if (leftData['public-repos'] > rightData['public-repos']) {
    leftScore++
    $('#leftPublicRepos').addClass('green')
    $('#rightPublicRepos').addClass('red')
  } else if (leftData['public-repos'] < rightData['public-repos']) {
    rightScore++
    $('#leftPublicRepos').addClass('red')
    $('#rightPublicRepos').addClass('green')
  } else {
    $('#leftPublicRepos').addClass('yellow')
    $('#rightPublicRepos').addClass('yellow')
  }

  // Score and Color Perfect-Repos
  if (leftData['perfect-repos'] > rightData['perfect-repos']) {
    leftScore++
    $('#leftPerfectRepos').addClass('green')
    $('#rightPerfectRepos').addClass('red')
  } else if (leftData['perfect-repos'] < rightData['perfect-repos']) {
    rightScore++
    $('#leftPerfectRepos').addClass('red')
    $('#rightPerfectRepos').addClass('green')
  } else {
    $('#leftPerfectRepos').addClass('yellow')
    $('#rightPerfectRepos').addClass('yellow')
  }

  // Score and Color Followers
  if (leftData.followers > rightData.followers) {
    leftScore++
    $('#leftFollowers').addClass('green')
    $('#rightFollowers').addClass('red')
  } else if (leftData.followers < rightData.followers) {
    rightScore++
    $('#leftFollowers').addClass('red')
    $('#rightFollowers').addClass('green')
  } else {
    $('#leftFollowers').addClass('yellow')
    $('#rightFollowers').addClass('yellow')
  }

  // Score and Color Following
  if (leftData.following > rightData.following) {
    leftScore++
    $('#leftFollowing').addClass('green')
    $('#rightFollowing').addClass('red')
  } else if (leftData.following < rightData.following) {
    rightScore++
    $('#leftFollowing').addClass('red')
    $('#rightFollowing').addClass('green')
  } else {
    $('#leftFollowing').addClass('yellow')
    $('#rightFollowing').addClass('yellow')
  }

  // compare scores and return winner or tie
  if (leftScore > rightScore) {
    return `The Winner is: ${leftData.username}`
  } else if (rightScore > leftScore) {
    return `The Winner is: ${rightData.username}`
  } else {
    $('#winnerAnnouncement').addClass('yellow')
    return "It's a Tie"
  }
}