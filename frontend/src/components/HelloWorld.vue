<script setup lang="ts">
import { ref, onMounted } from 'vue'

const modalEditar = ref(false)

const url = 'https://aluranodejsmongodb-wcco--3000--668d8eeb.local-corp.webcontainer.io/usuarios'

interface Formulario {
  nome: string
  email: string
}

interface Usuario {
  id: number
  nome: string
  email: string
}

const formulario = ref<Formulario>({
  nome: '',
  email: ''
})

const formEditar = ref<Formulario>({
  nome: '',
  email: ''
})

const usuarios = ref<Usuario[]>([])

const editarUsuarioId = ref<number | null>(null)

async function fetchUsuarios() {
  try {
    const resposta = await fetch(url)
    usuarios.value = await resposta.json()
  } catch (error) {
    console.log('Erro ao buscar usuários', error)
  }
}

onMounted(() => {
  fetchUsuarios()
})

async function salvar() {

  if (!formulario.value.nome.trim()) {
    alert('Informe o nome')
    return
  }

  if (!formulario.value.email.trim()) {
    alert('Informe o email')
    return
  }

  const emailExiste = usuarios.value.find(
    usuario =>
      usuario.email.toLowerCase() ===
      formulario.value.email.toLowerCase()
  )

  if (emailExiste) {
    alert('Este email já está cadastrado')
    return
  }

  try {

    const resposta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formulario.value)
    })

    const novoUsuario = await resposta.json()

    usuarios.value.push(novoUsuario)

    formulario.value = {
      nome: '',
      email: ''
    }

  } catch (error) {
    console.log('Erro ao cadastrar', error)
  }
}

async function remover(id: number) {

  try {

    if (!confirm('Deseja excluir este usuário?')) {
      return
    }

    await fetch(`${url}/${id}`, {
      method: 'DELETE'
    })

    usuarios.value = usuarios.value.filter(
      usuario => usuario.id !== id
    )

  } catch (error) {
    console.log('Erro ao excluir', error)
  }
}

function abrirModalEditar() {
  modalEditar.value = true
}

function fecharModalEditar() {
  modalEditar.value = false
}

function cancelarEdicao() {

  formEditar.value = {
    nome: '',
    email: ''
  }

  editarUsuarioId.value = null

  fecharModalEditar()
}

function editarUsuario(id: number) {

  const usuarioExiste = usuarios.value.find(
    usuario => usuario.id === id
  )

  if (!usuarioExiste) {
    return
  }

  editarUsuarioId.value = id

  formEditar.value = {
    nome: usuarioExiste.nome,
    email: usuarioExiste.email
  }

  abrirModalEditar()
}

async function salvarEdicao() {

  if (!formEditar.value.nome.trim()) {
    alert('Informe o nome')
    return
  }

  if (!formEditar.value.email.trim()) {
    alert('Informe o email')
    return
  }

  const emailExiste = usuarios.value.find(
    usuario =>
      usuario.email.toLowerCase() ===
      formEditar.value.email.toLowerCase() &&
      usuario.id !== editarUsuarioId.value
  )

  if (emailExiste) {
    alert('Este email já está cadastrado')
    return
  }

  try {

    const resposta = await fetch(
      `${url}/${editarUsuarioId.value}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formEditar.value)
      }
    )

    const usuarioAtualizado = await resposta.json()

    const index = usuarios.value.findIndex(
      usuario => usuario.id === editarUsuarioId.value
    )

    if (index !== -1) {
      usuarios.value[index] = usuarioAtualizado
    }

    cancelarEdicao()

  } catch (error) {
    console.log('Erro ao editar', error)
  }
}
</script>

<template>
  <div class="container">

    <h1>Lista de usuários</h1>

    <form
      class="form"
      @submit.prevent="salvar"
    >

      <div class="group__form">
        <label>Nome</label>
        <input
          type="text"
          class="field"
          v-model="formulario.nome"
          placeholder="Nome completo"
        >
      </div>

      <div class="group__form">
        <label>Email</label>
        <input
          type="email"
          class="field"
          v-model="formulario.email"
          placeholder="email@exemplo.com"
        >
      </div>

      <div class="actions">
        <button
          class="btn"
          type="submit"
        >
          Adicionar
        </button>
      </div>

    </form>

    <div
      class="form__modal"
      v-if="modalEditar"
    >
      <div class="form__editar">

        <h2 class="title__form">
          Atualizar dados
        </h2>

        <form
          class="form"
          @submit.prevent="salvarEdicao"
        >

          <div class="group__form">
            <label>Nome</label>

            <input
              type="text"
              class="field"
              v-model="formEditar.nome"
            >
          </div>

          <div class="group__form">
            <label>Email</label>

            <input
              type="email"
              class="field"
              v-model="formEditar.email"
            >
          </div>

          <div class="actions">

            <button
              class="btn"
              type="submit"
            >
              Salvar
            </button>

            <button
              class="btn"
              type="button"
              @click="cancelarEdicao"
            >
              Cancelar
            </button>

          </div>

        </form>

      </div>
    </div>

    <ul>

      <li
        v-for="usuario in usuarios"
        :key="usuario.id"
        class="card"
      >

        <p>
          <strong>Nome:</strong>
          {{ usuario.nome }}
        </p>

        <p>
          <strong>Email:</strong>
          {{ usuario.email }}
        </p>

        <div class="actions">

          <button
            class="btn"
            type="button"
            @click="editarUsuario(usuario.id)"
          >
            Editar
          </button>

          <button
            class="btn btn-danger"
            type="button"
            @click="remover(usuario.id)"
          >
            Excluir
          </button>

        </div>

      </li>

    </ul>

  </div>
</template>

<style scoped>
.container{
  max-width:800px;
  margin:auto;
  padding:2rem;
}

.form{
  display:flex;
  flex-direction:column;
  gap:.5rem;
}

.group__form{
  display:flex;
  flex-direction:column;
}

.field{
  padding:12px;
  border:1px solid #ccc;
  border-radius:6px;
}

.actions{
  display:flex;
  gap:1rem;
  margin-top:1rem;
}

.btn{
  padding:10px 16px;
  border:none;
  cursor:pointer;
  border-radius:6px;
}

.btn-danger{
  background:#dc3545;
  color:white;
}

.card{
  box-shadow:0 0 5px #00000030;
  border-radius:8px;
  padding:1rem;
  margin-top:1rem;
}

.form__modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);

  display:flex;
  align-items:center;
  justify-content:center;
}

.form__editar{
  background:white;
  padding:1.5rem;
  border-radius:10px;
  max-width:450px;
  width:100%;
}

.title__form{
  text-align:center;
  margin-bottom:1rem;
}
</style>