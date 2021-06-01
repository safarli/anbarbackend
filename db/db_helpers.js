const {mypool} = require('./db_conn')

exports.getProductTypes = async (req, res) => {
    const {user} = req

    // if(!user) {  // Always check if the value is truthy before accessing its properties. Never try to access property of undefined object. It will throw error
    //     return res.status(401).json({msg: "No user data found in token"})
    // }
    // else if(!isAdminUser(user.role)){
    //     return res.status(401).json({msg: "Admin users can access"})
    // }

    try {
        const { rows } = await mypool.query(`SELECT * FROM mehsul_tipleri`)
        return res.status(200).json(rows);
    }
    catch (e) {
        res.status(500).json({ "error": e.message })
        throw e.message;
    }

}

exports.getProductProviders = async (req, res) => {
    const {user} = req

    // if(!user){
    //     res.status(401).json({msg: "No user data found in token"})
    // }
    // else if (!isAdminUser(user.role)){
    //     res.status(401).json({msg: "Admin users can access"})
    // }
    
    try {
        const { rows } = await mypool.query(`SELECT * FROM saticilar`)
        return res.status(200).json(rows)
    }
    catch (e) {
        res.status(500).json({ "error": e.message })
        throw e.message;
    }

}