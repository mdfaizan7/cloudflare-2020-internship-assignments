addEventListener('fetch', async (event) => {
  event.respondWith(handleRequest(event.request))
})

// contains links data
const linksData = [
  { name: 'My Github Profile', url: 'https://github.com/mdfaizan7' },
  {
    name: 'My Linkedin Profile',
    url: 'https://www.linkedin.com/in/mohammad-faizan-azim-8a84b1142/',
  },
  { name: 'My Portfolio', url: 'https://mdfaizan7.github.io/' },
]


// contains social data
const socialData = [
      {
        img: "https://miro.medium.com/max/720/1*mQz1eSo1ZkL-Rufb5Xfrqw.png",
        src:"https://www.reddit.com/user/faizu07"
      },
      {
        img: "https://image.flaticon.com/icons/png/512/281/281769.png",
        src:"mailto:faizaanazim@gmail.com"
      },
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png",
        src:"https://www.instagram.com/md_faizan7/"
      },
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/600px-Telegram_logo.svg.png",
        src:"https://t.me/mdfaizan7/"
      },
    ]


// return the response 
const getResponse = async (response) => {
  const { headers } = response
  const contentType = headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  } else if (contentType.includes('application/text')) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}

// Handles the div#links
class LinksHandler {
  constructor(links) {
    this.links = links
  }

  element(element) {
    this.links.map((item) => {
      element.append(`<a href="${item.url}" target="_blank">${item.name}</a>`, {
        html: true,
      })
    })
  }
}

// removes the display:none property from style
class Show {
  element(element) {
    element.removeAttribute('style')
  }
}

// handles the div#social
class SocialHandler {
  constructor(social) {
    this.social = social
  }
  element(element) {
    this.social.map((item) => {
      element.append(`<a href="${item.src}" target="_blank"><img src="${item.img}" alt="social" /> </a>`, {
        html: true,
      })
    })
  }
}

// Adds the avatar to the page
class AvatarHandler {
  element(element) {
    element.setAttribute(
      'src',
      'https://avatars0.githubusercontent.com/u/42090492?s=460&u=52f6acd51a9d028d370b06378a4d03cbdd68db84&v=4',
    )
  }
}

// Add my name to the page
class NameHandler {
  element(element) {
    element.append('Mohammad Faizan Azim')
  }
}

// Adds the title to the page
class TitleHandler {
  element(element) {
    element.setInnerContent('Mohammad Faizan Azim')
  }
}

// changes the background color to blue
class setBackground {
  element(element) {
    element.setAttribute('class', 'bg-blue-700')
  }
}

// handles the request
const handleRequest = async (req) => {
  if (req.url === 'https://links-tree.faizaanazim.workers.dev/links') {
    const res = JSON.stringify(linksData, null, 2)

    return new Response(res, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  }

  const htmlRes = await fetch(
    'https://static-links-page.signalnerve.workers.dev',
    {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    },
  )
  const html = await getResponse(htmlRes)

  return new HTMLRewriter()
    .on('div[id="links"]', new LinksHandler(linksData))
    .on('div[id="profile"]', new Show())
    .on('img[id="avatar"]', new AvatarHandler())
    .on('h1[id="name"]', new NameHandler())
    .on('div[id="social"]', new Show())
    .on('title', new TitleHandler())
    .on('body', new setBackground)
    .on('div[id="social"]', new SocialHandler(socialData))
    .transform(
      new Response(html, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      }),
    )
}
