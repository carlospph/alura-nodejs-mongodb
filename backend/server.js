import express from 'express';

const app = express();

const livros = [
    {
        id:1,
        titulo:"O Hobbit",
        autor:"Homilio Santos"
    },
    {
        id:2,
        titulo:"Casa grande e pequena",
        autor:"Carlitos Mineiro"
    }
]

const usuarios = [
    {
        id:1,
        nome:"Carlos Nascimento",
        email: "carlosnascim@gmail.com"
    },
         {
            id:2,
            nome:"Joaquim Silva",
            email: "joaquimsilva@gmail.com"
     }
]


// ========= ========== LIVROS =============

app.get('/', (req, res) => {
    res.status(200).send("home");
  });

  app.get('/livros', (req, res) => {
    res.status(200).json(livros);
  });
  

app.post('/usuarios',(req, res)=>{
    res.status(201).send("criado com sucesso")
})

app.put('/usuarios/:id',(req, res)=>{
    res.status(200).send("atualizado")
})

app.delete('/usuarios/:id',(req, res)=>{
    res.status(200).send("deletado")
})

// fim ================ LIVROS ======= ============ ========= 



//================= ===== USUÁRIOS ====== ==================== 
app.get('/usuarios', (req, res) => {
    res.status(200).json(livros);
  });

// fim ========== ======= USUÁRIOS ======== =========== ======

 
app.listen(3000, () => {
  console.log('Servidor rodando   em http://localhost:3000');
});