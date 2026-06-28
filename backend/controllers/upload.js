export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' })
    res.json({
      url: req.file.path,
      cloudinaryId: req.file.filename,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files' })
    const results = req.files.map(f => ({ url: f.path, cloudinaryId: f.filename }))
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const uploadPublic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' })
    res.json({
      url: req.file.path,
      cloudinaryId: req.file.filename,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
