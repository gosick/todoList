var db = require('../util/db')

function Todo() {
  this.get = (res) => {
    db.acquire((err, con) => {
      con.query('select * from todo_list', (err, result) => {
        con.release()
        res.send(result)
      })
    })
  }

  this.getActive = (res) => {
    db.acquire((err, con) => {
      con.query('select * from todo_list where completed = 0', (err, result) => {
        con.release()
        res.send(result)
      })
    })
  }

  this.getCompleted = (res) => {
    db.acquire((err, con) => {
      con.query('select * from todo_list where completed = 1', (err, result) => {
        con.release()
        res.send(result)
      })
    })
  }

  this.create = (todo, res) => {
    db.acquire((err, con) => {
      con.query('insert into todo_list set name = ?', todo, (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: '新增失敗', error: err})
        } else {
          res.send({status: 0, message: '新增成功'})
        }
      })
    })
  }

  this.update = (todo, res) => {
    db.acquire((err, con) => {
      con.query('update todo_list set name = ? where id = ?', [todo.name, todo.id], (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: '修改失敗', error: err})
        } else {
          res.send({status: 0, message: '修改成功'})
        }
      })
    })
  }

  this.updateStatus = (todo, res) => {
    db.acquire((err, con) => {
      con.query('update todo_list set completed = ? where id = ?', [todo.completed, todo.id], (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: '修改失敗', error: err})
        } else {
          res.send({status: 0, message: '修改成功'})
        }
      })
    })
  }

  this.delete = (id, res) => {
    db.acquire((err, con) => {
      con.query('delete from todo_list where id = ?', id, (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: '刪除失敗', error: err})
        } else {
          res.send({status: 0, message: '刪除成功'})
        }
      })
    })
  }

  this.deleteList = (list, res) => {
    db.acquire((err, con) => {
      con.query('delete from todo_list where id in ( ? )', [list], (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: '刪除失敗', error: err})
        } else {
          res.send({status: 0, message: '刪除成功'})
        }
      })
    })
  }
}

module.exports = new Todo()