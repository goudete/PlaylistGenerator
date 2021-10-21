module.exports = (req, res) => {
	res.redirect(307, `/execute/${req.body.endpoint}`)
}