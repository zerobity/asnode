const express = require('express');
const peopleRouter = express.Router();

const idFilter = req => member => member.id === parseInt(req.params.dni);
const {dbconn, dbstmt} = require('idb-connector');
const conn = new dbconn();
conn.conn('*LOCAL');

// Obtiene todas las personas

peopleRouter.get('/', (req, res) => {
    const statement = new dbstmt(conn);
    var sql = 'select * from c00aw1.bapfis'
    statement.prepare(sql, (err) => {
        statement.execute((result, err) => {
            statement.fetchAll((data) => {
                console.log(`Result is : ${JSON.stringify(data)}`);
                console.log(err);
                statement.close();
                res.render('index-people', {
                    title: 'Personas',
                    people: data,
                })
            });
        });
    });
});

// Nueva perosna
peopleRouter.get('/create', (req, res) => {
    res.render('create-people', {
        title: 'Nueva Persona',
    })
});

peopleRouter.post('/', (req, res) => {
    const statement = new dbstmt(conn);
    var sql = 'insert into c00aw1.bapfis (PEINDO, PENYAP, PEMAIL, PEFNAC, PEESTA) values (?, ?, ?, ?, ?) WITH NONE';
    var params = [
        parseInt(req.body.PEINDO),
        req.body.PENYAP,
        req.body.PEMAIL,
        parseInt(req.body.PEFNAC),
        1
    ];
    console.log(params);

    statement.prepare(sql, (err) => {
        statement.bindParameters(params ,(err) => {
            statement.execute((result, err) => {
                console.log(result);
                console.log(err);
                statement.close();
                res.redirect('/personas');
            });
        });
    });    
    
});

// Actualiza persona
peopleRouter.get('/edit/:dni', (req, res) => {
    const statement = new dbstmt(conn);
    var sql = 'select * from c00aw1.bapfis where PEINDO = ?';
    var params = [parseInt(req.params.dni)];

    statement.prepare(sql, () => {
        statement.bindParameters(params ,() => {
            statement.execute(() => {
                statement.fetchAll((data) => {
                    console.log(`Result is : ${JSON.stringify(data)}`);
                    console.log(err);
                    statement.close();
                    res.render('edit-people', {
                        title: 'Editar Persona',
                        person: data[0]
                    })
                });
            });
        });
    });
});

peopleRouter.post('/:dni', (req, res) => {
    const statement = new dbstmt(conn);
    var sql = 'update c00aw1.bapfis set PENYAP = ?, PEMAIL = ?, PEFNAC = ? where PEINDO = ?';
    var params = [
        req.body.PENYAP,
        req.body.PEMAIL,
        parseInt(req.body.PEFNAC),
        parseInt(req.params.dni)
    ];
    console.log(params);

    statement.prepare(sql, (err) => {
        statement.bindParameters(params ,(err) => {
            statement.execute((result, err) => {
                console.log(result);
                statement.close();
                res.redirect('/personas');
            });
        });
    });
});

// Delete Member
peopleRouter.post('/delete/:dni', (req, res) => {
    const statement = new dbstmt(conn);
    var sql = 'delete c00aw1.bapfis where PEINDO = ?';
    var params = [
        parseInt(req.params.dni)
    ];
    console.log(params);

    statement.prepare(sql, (err) => {
        statement.bindParameters(params ,(err) => {
            statement.execute((result, err) => {
                console.log(result);
                statement.close();
                res.redirect('/personas');
            });
        });
    });
});

module.exports = peopleRouter;

