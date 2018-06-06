<template>
  <section class="todoapp">
  <header>
    <h1>todos</h1>
    <input class="new-todo" placeholder="Todo!" autofocus v-model="newTodo" @keyup.enter="addTodo">
  </header>
    <section>
      <ul>
        <li v-for="(todo, index) in todolist" :class="{'completed': todo.completed, 'editing': todo === editedTodo}">
          <div class="view">
            <button class="destroy" @click="removeTodo(todo, index)"></button>
            <button class="finish" @click="updateFinish(todo, index)">Done</button>
            <button class="undo" @click="updateUndo(todo, index)">Undo</button>
            <button class="editbutton" @click="editingTodo(todo)">edit</button>
            <label class="todo-value">{{ todo.name }}</label>
          </div>
          <input class="edit" type="text" v-model="todo.name" v-todo-focus="todo == editedTodo" @keyup.enter="editTodo(todo)">
        </li>
      </ul>
    </section>
  <footer class="footer">
    <ul class="filters">
      <li>
        <button class="clear-completed" @click="getAll">All {{ countTodo }}</button>
      </li>
      <li>
        <button class="clear-completed" @click="getActive">Active {{ countTodo - completedTodo }}</button>
      </li>
      <li>
        <button class="clear-completed" @click="getCompleted">Completed {{ completedTodo }}</button>
      </li>
      <li v-if="countTodo > completedTodo && getflag == 'completed'">
        <button class="clear-completed" @click="removeCompleted" >Clear completed</button>
      </li>
    </ul>

  </footer>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import querystring from '~/plugins/querystring'

export default {
  async asyncData () {
    let { data } = await axios.get('/api/todo')
    return { todolist: data }
  },
  head () {
    return {
      title: 'todoList'
    }
  },
  data () {
    return {
      newTodo: '',
      editedTodo: null,
      todolist: null,
      todocompletedlength: 0,
      completedlist: null,
      listnum: {
        flag: 'all',
        all: 0,
        active: 0,
        completed: 0
      }
    }
  },
  computed: {
    getflag () {
      return this.listnum.flag
    },
    countTodo () {
      if (this.listnum.all === 0 && this.listnum.flag === 'all') {
        this.listnum.all = this.todolist.length
      }
      return this.listnum.all
    },
    completedTodo () {
      if (this.listnum.flag === 'all') {
        this.listnum.all = this.todolist.length
        this.listnum.active = 0
        this.listnum.completed = 0
        for (var index = 0; index < this.todolist.length; index++) {
          if (this.todolist[index].completed === 0) {
            this.listnum.active += 1
          } else {
            this.listnum.completed += 1
          }
        }
      } else if (this.listnum.flag === 'completed') {
        let count = 0
        let listlength = this.todolist.length
        for (var index3 = 0; index3 < this.todolist.length; index3++) {
          if (this.todolist[index3].completed === 0) {
            count += 1
          }
          this.listnum.completed = listlength - count
        }
      } else if (this.listnum.flag === 'active') {
        let count = 0
        let listlength = this.todolist.length
        for (var index2 = 0; index2 < this.todolist.length; index2++) {
          if (this.todolist[index2].completed === 1) {
            count += 1
          }
        }
        this.listnum.completed = this.listnum.all - (listlength - count)
      }
      return this.listnum.completed
    }
  },
  methods: {
    getAll () {
      axios.get('/api/todo')
        .then((response) => {
          this.listnum.flag = 'all'
          this.listnum.all = this.todolist.length
          this.listnum.active = this.todolist.length
          this.listnum.completed = this.listnum.all - this.listnum.active
          this.todolist = response.data
        })
    },
    getActive () {
      axios.get('/api/active')
        .then((response) => {
          this.listnum.flag = 'active'
          this.todolist = response.data
        })
    },
    getCompleted () {
      axios.get('/api/completed')
        .then((response) => {
          this.listnum.flag = 'completed'
          this.todolist = response.data
        })
    },
    addTodo () {
      var value = this.newTodo && this.newTodo.trim()
      if (value) {
        this.newTodo = ''
        axios.post('/api/addTodo', querystring.stringify({name: value}))
          .then((response) => {
            if (this.listnum.flag === 'all' || this.listnum.flag === 'active') {
              let lastId = this.todolist[this.todolist.length - 1].id
              let newId = lastId + 1
              let newTodo = {
                id: newId,
                name: value,
                completed: 0
              }
              this.todolist[this.todolist.length] = newTodo
            }
            this.listnum.all += 1
            this.listnum.active += 1
          })
      }
    },
    editTodo (todo) {
      let id = todo.id
      let name = todo.name && todo.name.trim()
      if (id && name) {
        axios.post('/api/editTodo', querystring.stringify({id: id, name: name}))
          .then((response) => {
            console.log(response)
          })
      }
      this.editedTodo = null
    },
    removeTodo (todo, index) {
      let id = todo.id
      if (id) {
        axios.post('/api/deleteTodo', querystring.stringify({id: todo.id}))
          .then((response) => {
            if (this.listnum.flag === 'completed') {
              this.listnum.all -= 1
              this.listnum.completed -= 1
            }
            if (this.listnum.flag === 'active') {
              this.listnum.all -= 1
            }
            this.todolist.splice(index, 1)
          })
      }
    },
    updateFinish (todo, index) {
      let status = todo.completed
      let id = todo.id
      if (status === 0) {
        let completed = 1
        axios.post('/api/updateFinish', querystring.stringify({id: id, completed: completed}))
          .then((response) => {
            if (index !== 'undefined' && typeof this.todolist[index] !== 'undefined') {
              this.todolist[index].completed = 1
            }
          })
      }
    },
    updateUndo (todo, index) {
      let status = todo.completed
      let id = todo.id
      if (status === 1) {
        let completed = 0
        axios.post('/api/updateFinish', querystring.stringify({id: id, completed: completed}))
          .then((response) => {
            if (index !== 'undefined' && typeof this.todolist[index] !== 'undefined') {
              this.todolist[index].completed = 0
            }
          })
      }
    },
    editingTodo (todo) {
      this.beforeEditCache = todo.name
      this.editedTodo = todo
    },
    removeCompleted () {
      var completedlist = []
      var count = 0
      var completedindex = []
      this.completedlist = []
      for (let index = 0; index < this.todolist.length; index++) {
        if (this.todolist[index].completed === 1) {
          this.completedlist[count] = this.todolist[index]
          completedlist[count] = this.todolist[index].id
          completedindex[count] = index
          count++
        }
      }
      axios.post('/api/deleteComplete', querystring.stringify({completedlist: completedlist}))
        .then((response) => {
          this.listnum.all -= completedindex.length
          this.listnum.completed = 0
          this.todolist.splice(completedindex[count], completedindex.length)
        })
    }
  },
  directives: {
    'todo-focus' (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
</script>
