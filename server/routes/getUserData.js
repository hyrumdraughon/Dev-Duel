import axios from 'axios'
import token from '../../token'

export default async (username) => {
    let userData = await axios.get(`http://api.github.com/users/${username}`, 
    {
        headers: {
            'Authorization': token
        }
    })

    userData = userData.data

    // Structure our object by using key value

    const userObject = {
        username: userData.login,
        name: userData.name,
        location: userData.location,
        bio: userData.bio,
        'avatar-url': userData.avatar_url,
        titles: await getUserTitles(userData),
        'favorite-language': await getFavoriteLanguage(userData),
        'public-repos': userData.public_repos,
        'total-stars': await getTotalStars(userData),
        'highest-starred': await getHighestStarred(userData),
        'perfect-repos': await getPerfectRepos(userData),
        followers: userData.followers,
        following: userData.following
    }

    return userObject
}

const baseUrl = 'http://api.github.com/users'

const getUserRepoData = async (username, repoCount) => {
    const pages = (Math.floor(repoCount / 100) + 1)

    let query = `${baseUrl}/${username}/repos?per_page=100&page=1`
    const response = await axios.get(query, {
        headers: {
            'Authorization': token
        }
    })
    let repoResponseData = response.data

    for (let p = 2; p <= pages; p++) {
        query = `${baseUrl}/${username}/repos?per_page=100&page=${p}`
        const tempResponse = await axios.get(query, {
            headers: {
                'Authorization': token
            }
        })
        repoResponseData = repoResponseData.concat(tempResponse.data)
    }
    return repoResponseData
}

let repoData = []

const getUserTitles = async (userDataObject) => {
    let titles = []
    repoData = await getUserRepoData(userDataObject.login, userDataObject.public_repos)

    // Forker
    const forkRepos = repoData.filter(userForkData => userForkData.fork === true)
    if ((forkRepos.length >= repoData.length / 2) && (forkRepos.length > 0)) {
        titles.push('Forker')
    }

    // One-Trick Pony
    let languages = {}
    for (let repo of repoData) {
        if (!(repo.language in languages)) {
            languages[repo.language] = 1
        }
    }
    if (Object.keys(languages).length === 1) {
        titles.push('One-Trick Pony')
    }

    // Jack of all Trades
    if (Object.keys(languages).length >= 10) {
        titles.push('Jack of all Trades')
    }

    // Stalker
    if ((userDataObject.following >= userDataObject.followers * 2) && (userDataObject.following > 0)) {
        titles.push('Stalker')
    }

    // Mr.Popular
    if ((userDataObject.followers >= userDataObject.following * 2) && (userDataObject.followers > 0)) {
        titles.push('Mr.Popular')
    }

    // Custom title: Veteran
    if (repoData.length >= 100) {
        titles.push('Veteran')
    }

    return titles
}

const getFavoriteLanguage = async (userDataObject) => {
    let languages = {}
    for (let repo of repoData) {
        if (!(repo.language in languages)) {
            languages[repo.language] = 1
        } else {
            languages[repo.language] += 1
        }
    }

    let max = 0
    let favoriteLanguage
    for (let key in languages) {
        if (languages[key] > max) {
            favoriteLanguage = key
            max = languages[key]
        }
    }
    return favoriteLanguage
}

const getTotalStars = async (userDataObject) => {
    let totalStars = 0
    for (let repo of repoData) {
        totalStars += repo.stargazers_count
    }
    return totalStars
}

const getHighestStarred = async (userDataObject) => {
    let max = 0
    for (let repo of repoData) {
        if (repo.stargazers_count > max) {
            max = repo.stargazers_count
        }
    }
    return max
}

const getPerfectRepos = async (userDataObject) => {
    
    const perfectRepos = repoData.filter(curr => curr.open_issues === 0)
    return perfectRepos.length
}