import SiteSetting, { defaultSettings } from '../models/SiteSetting.js'

export const getAll = async (req, res) => {
  try {
    const settings = await SiteSetting.find()
    const map = {}
    settings.forEach(s => { map[s.key] = s.value })
    res.json({ ...defaultSettings, ...map })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const update = async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await SiteSetting.findOneAndUpdate({ key }, { value }, { upsert: true })
    }
    res.json({ message: 'Saved' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
