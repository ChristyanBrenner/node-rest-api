const http = require('http')

const JsonHeader = { 'Content-Type': 'application/json' }

const server = http.createServer((request, response) => {

 //GET /hello/:name -> Hello ${name} !
 if (request.method == 'GET' && /^\/hello\/\w+$/.test(request.url)) {
  const [,, name] = request.url.split('/')
  response.writeHead(200)
  response.end('Hello ${name}!\n')
  return
 }

 //GET /hello -> Hello Wolrd!
 if (request.method == 'GET' && request.url.startsWith('/hello')) {
  response.writeHead(200)
  response.end('Hello World!\n')
  return
}

//  POST /echo
if(request.method == 'POST' && request.url.startsWith('/echo')) {
  response.writeHead(200)
  request.pipe(response)
  return
}

// **************
// **API TODOS**
// **************

// { id, title, text}

// POST /todos

if (request.method == 'POST' && request.url.startsWith('/todos')) {
  let boryRaw = ''

  request.on('data', data => boryRaw += data)

  request.once('end', () => {
    const todo = JSON.parse(boryRaw)
    todosDatabase.insert(todos)
    .then(inserted => {
      response.writeHead(201, JsonHeader)
      response.end(JSON.stringify(inserted))
    })
  })

  return
}

// GET /todos/:id

if (request.method == 'GET' && /^\/todos\/d+$/.test(request.url)) {
  const [,, idRaw] = request.url.split('/')
  const id = parseInt(idRaw)

  todosDatabase
    .get(id)
    .then(todo => {
      if (!todo) {
        response.writeHead(400, JsonHeader)
        response.end({ message: 'Resource not found' })
      } else {
        response.writeHead(200, JsonHeader)
        response.end(todo)
      }
    })

    return
}

// GET /todos

if (request.method == 'GET' && request.url.startsWith('/todos')) {
  todosDatabase
  .list()
  .then(todos => {
    response.writeHead(200, JsonHeader)
    response.end(JSON.stringify({todos}))
  })
  return
}


// DELETE /todos/:id

if (request.method == 'DELETE' && /^\/todos\/d+$/.test(request.url)) {
  const [,, idRaw] = request.url.split('/')
  const id = parseInt(idRaw)

  todosDatabase
    .del(id)
    .then(() => {
      response.writeHead(204)
      response.end()
    })

  return
}


// PUT /todos/:id



response.writeHead(404)
response.end('Resource not found\n')

})

server.listen(3000, '0.0.0.0', () => {
  console.log('Server started')
})
