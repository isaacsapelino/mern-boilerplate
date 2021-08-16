const express = require('express');
const app = express();

const sequelize = require('./db/database');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const helmet = require('helmet');
const cors= require('cors');
const morgan = require('morgan');

/* Models */
const users = require('./models/users');

/* Routes */
const routes = require('./routes');

/* Libraries */
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use('/api/user', routes.user);
app.get('/api', (req, res) => {
    res.send('Hello World');
})


sequelize.sync()
    .then(result => {
        console.log(`Database has been connected to port ${result.config.port}`);
        app.listen(PORT, () => {
            console.log(`App is listening at port ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });

