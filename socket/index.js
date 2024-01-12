const { Server } = require('socket.io')

const io = new Server({ cors: 'http://localhost:5173' })

let onlineUser = []
io.on('connection', socket => {
  console.log('New Connection', socket.id)

  // LISTEN AN EVENT FROM CLIENT
  socket.on('addNewUser', userId => {
    // CHECK IF ONLINE USER EXISTS AND THEN NOT TO PUSH ONLINE USERs
    !onlineUser.some(user => user.userId === userId) &&
      onlineUser.push({
        userId,
        socketId: socket.id
      })
    console.log('Online User Terminal', onlineUser)
    io.emit('getOnlineUsers', onlineUser) // GỬI SỰ KIẾN XUỐNG CLIENT
  })

  // ADD MESSAGE
  socket.on('sendMessage', message => {
    const user = onlineUser.find(user => user.userId === message.recipientId)

    // TRIGGER EVENT GET MESSAGE
    if (user) {
      io.to(user.socketId).emit('getMessage', message)
      io.to(user.socketId).emit('getNotification', {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      })
    }
  })

  // DISCONNECT SOCKET
  socket.on('disconnect', () => {
    onlineUser = onlineUser.filter(user => user.socketId !== socket.id)
    io.emit('getOnlineUsers', onlineUser) // Cập nhật lại sanh sách online sau khi ng dùng đăng xuấT kết nối
  })
})

io.listen(3100)
