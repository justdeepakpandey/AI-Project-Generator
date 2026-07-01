const generateProject = (req, res) => {
    const data = req.body;
    console.log(data);
    res.status(200).json({
        success: true,
        message: "Backend Connected Successfully",
        data
    });
};
module.exports = {
    generateProject
};