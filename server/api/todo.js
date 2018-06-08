import { Router } from 'express'

const router = Router()

let todo = require('../model/todo')

// add todo
router.post('/addTodo', (req, res) => {
  todo.create(req.body.name, res)
})

// get all todo
router.get('/todo', (req, res) => {
  todo.get(res)
})

// edit todo
router.post('/editTodo', (req, res) => {
  todo.update(req.body, res)
})

// delete todo
router.post('/deleteTodo', (req, res) => {
  todo.delete(req.body.id, res)
})

// updateFinish
router.post('/updateFinish', (req, res) => {
  todo.updateStatus(req.body, res)
})

// remove Completed
router.post('/deleteComplete', (req, res) => {
  todo.deleteList(req.body.completedlist, res)
})

// get uncompleted
router.get('/active', (req, res) => {
  todo.getActive(res)
})

// get completed
router.get('/completed', (req, res) => {
  todo.getCompleted(res)
})

export default router