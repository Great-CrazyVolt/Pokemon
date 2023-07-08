const express = require('express')
const pool = require('./dbpool')

const app = express();

const executeSQL = (sql, params) => {
    return new Promise(function (resolve, reject){
        pool.query(sql, params, function(err, rows, field){
            if(err) throw err
            resolve(rows)
        })
    })
}
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {

    let sql = "SELECT monsterId, name, imgName, score FROM exam_monsters ORDER BY score DESC limit 5"

    let rows = await executeSQL(sql)

    res.render('index', {"monsters" : rows})
})

app.get('/listPage', async(req, res) => {
    let sql = "SELECT * FROM exam_elements"

    const rows = await executeSQL(sql)

    let sql1 = "SELECT monsterId, name, moveSet, firstCaught, description, imgName, score, elementId FROM exam_monsters"

    let monsters = await executeSQL(sql1)

    res.render('listPage', {"pokemonElement" : rows, "monsters" : monsters})
})

app.post('/listPage', async (req, res) => {
    let name = req.body.name
    let description = req.body.description
    let element = req.body.element
    let moveSet = req.body.moveSet
    let dateCaught = req.body.dateCaught
    let imgName = req.body.imgName
    let score = req.body.score

    let sql = `INSERT INTO exam_monsters(name, moveSet, firstCaught, description, imgName, score, elementId) 
                VALUES (? , ?, ? , ?, ?, ?, ?)`
    
    let params = [name, moveSet, dateCaught, description, imgName, score, element]

    let row = await executeSQL(sql, params)

    sql = "SELECT * FROM exam_elements"

    row = await executeSQL(sql)

    res.render('listPage', {"pokemonElement" : rows , 'message' : "Successfully inserted" })

})

app.get('/pokemon/edit', async (req, res) => {
    let monsterId = req.query.id

    let sql = `SELECT name, imgName FROM exam_monsters WHERE monsterId = ?`

    let params = [monsterId]

    let row = await executeSQL(sql, params)

    res.render('pokemonEdit', {'pokeData': row, "monsterId": monsterId})

})

app.post('/pokemon/edit', async (req, res) => {
    let monsterId = req.body.monsterId

    let score = req.body.score

    let sql = `UPDATE exam_monsters SET score = ${score} WHERE monsterId = ${monsterId}`

    let row = await executeSQL(sql)

    sql = `SELECT name, imgName FROM exam_monsters WHERE monsterId = ?`

    let params = [monsterId]

    row = await executeSQL(sql, params)

    res.render('pokemonEdit', {'pokeData': row,"monsterId": monsterId, "message": "Successfully Updated!"})
})

app.get('/pokemonQuiz', async (req, res) => {
    let sql = "SELECT monsterId, name, imgName FROM exam_monsters ORDER BY RAND() LIMIT 1 "

    let row = await executeSQL(sql)

    sql = "SELECT * from exam_elements"

    let row2 = await executeSQL(sql)

    res.render('pokemonQuiz', {"pokeData": row, "elements" : row2})

})

app.post('/pokemonQuiz', async (req, res) => {
    let element = req.body.pokeElement;
    let monsterId = req.body.monsterId

    let checkAnswerSQL = "SELECT monsterId from exam_monsters WHERE elementId = ? AND monsterId = ?"
    
    let params = [element, monsterId]

    let checkAnswer = await executeSQL(checkAnswerSQL, params)

    let sql = "SELECT monsterId, name, imgName FROM exam_monsters ORDER BY RAND() LIMIT 1 "

    let row = await executeSQL(sql)

    sql = "SELECT * from exam_elements"

    let row2 = await executeSQL(sql)

    if(checkAnswer.length!= 0){
        res.render('pokemonQuiz', {"message": "Correct", "pokeData": row, "elements" : row2})
    }
})

app.use('/api/monster/:id', async (req, res) =>{
    let monsterId = req.params.id

    let sql = `SELECT * FROM exam_monsters
                WHERE monsterId = ?`
    
    let params = [monsterId]

    let rows = await executeSQL(sql, params)
    res.send(rows)
})



app.listen(3000, () => {
    console.log('Server is listing on PORT 3000')
})