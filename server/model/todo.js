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

  this.getCount = (res) => {
    db.acquire((err, con) => {
      con.query('select count(*) as nums from todo_list where completed = 0', (err , result) => {
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
          res.send({status: 1, message: 'TODO creation failed', error: err, todo: todo})
        } else {
          res.send({status: 0, message: 'TODO created successfully'})
        }
      })
    })
  }

  this.getOne = (id, res) => {
    db.acquire((err, con) => {
      con.query('select * from todo_list where id = ?', id, (err, result) => {
        con.release()
        res.send(result)
      })
    })
  }

  this.update = (todo, res) => {
    db.acquire((err, con) => {
      con.query('update todo_list set name = ? where id = ?', [todo.name, todo.id], (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: 'TODO update failed'})
        } else {
          res.send({status: 0, message: 'TODO updated successfully'})
        }
      })
    })
  }

  this.updateStatus = (todo, res) => {
    db.acquire((err, con) => {
      con.query('update todo_list set completed = ? where id = ?', [todo.completed, todo.id], (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: 'TODO update failed'})
        } else {
          res.send({status: 0, message: 'TODO updated successfully'})
        }
      })
    })
  }

  this.delete = (id, res) => {
    db.acquire((err, con) => {
      con.query('delete from todo_list where id = ?', id, (err, result) => {
        con.release()
        if (err) {
          res.send({status: 1, message: 'Failed to delete'})
        } else {
          res.send({status: 0, message: 'Deleted successfully'})
        }
      })
    })
  }

  this.deleteList = (list, res) => {
    db.acquire((err, con) => {
      con.query('delete from todo_list where id in ( ? )', [list], (err, result) => {
        con.release()
        console.log(result)
        if (err) {
          res.send({status: 1, message: 'Failed to delete'})
        } else {
          res.send({status: 0, message: 'Deleted successfully'})
        }
      })
    })
  }
}

module.exports = new Todo()