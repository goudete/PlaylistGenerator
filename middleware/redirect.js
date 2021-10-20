modules.export = (req, res) => {
	res.redirect(307, `/execute/${req.body.endpoint}`)
}