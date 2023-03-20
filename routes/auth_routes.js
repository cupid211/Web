const {Router} = require ("express")
const router = Router()


router.get('/', (req,res)=>{
    res.render('index')
})

router.get('/statistics', (req,res)=>{
    res.render('Статистика')
})

// api/auth/register
// router.post('/register', async(req,res)=>{

// })

// router.post('/login', async (req,res)=>{

// })

module.exports = router