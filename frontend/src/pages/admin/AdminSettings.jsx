import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Save, Settings, Phone, Image, Info, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SectionHeader from '../../components/admin/SectionHeader'
import UploadZone from '../../components/admin/UploadZone'
import { motion } from 'framer-motion'

const fieldGroups = [
  {
    title: 'General', description: 'Basic business information', icon: Settings,
    fields: [
      { key: 'siteName', label: 'Site Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'openingHours', label: 'Opening Hours', type: 'text' },
    ],
  },
  {
    title: 'Contact', description: 'Phone and social media', icon: Phone,
    fields: [
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'instagram', label: 'Instagram Username', type: 'text' },
      { key: 'mapUrl', label: 'Google Maps Embed URL', type: 'text' },
    ],
  },
  {
    title: 'Hero Section', description: 'Hero banner content', icon: Image,
    fields: [
      { key: 'heroTitle', label: 'Hero Title', type: 'text' },
      { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'text' },
    ],
  },
  {
    title: 'About Section', description: 'About the artist', icon: Info,
    fields: [
      { key: 'aboutTitle', label: 'About Title', type: 'text' },
      { key: 'aboutText', label: 'About Text', type: 'textarea' },
    ],
  },
  { title: 'Footer', description: 'Footer text', icon: FileText, fields: [{ key: 'footerText', label: 'Footer Text', type: 'textarea' }] },
]

const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-base-content/40'
const fieldWrapClass = 'form-control w-full flex flex-col gap-2.5'
const fieldsStackClass = 'flex flex-col gap-6'
const cardClass = 'bg-base-100 rounded-2xl border border-base-200 p-7 shadow-sm hover:shadow-md transition-shadow'
const cardHeaderClass = 'flex items-center gap-3 mb-7 pb-5 border-b border-base-200'
const inputClass = 'input w-full rounded-lg border border-base-300/70 bg-base-200/70 px-3.5 h-11 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors'
const textareaClass = 'textarea w-full rounded-lg border border-base-300/70 bg-base-200/70 px-3.5 py-3 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors min-h-[100px] resize-y leading-relaxed'

export default function AdminSettings() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, watch, setValue, formState: { isDirty } } = useForm()

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  })

  useEffect(() => { if (settings) reset(settings) }, [settings, reset])

  const mutation = useMutation({
    mutationFn: (data) => api.put('/settings', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }); toast.success('Settings saved') },
    onError: () => toast.error('Failed'),
  })

  return (
    <div>
      <SectionHeader title="Site Settings" description="Customize your website" />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-10">
        <div className="grid md:grid-cols-2 gap-8">
          {fieldGroups.map((group, gi) => {
            const Icon = group.icon
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06 }}
                className={cardClass}
              >
                <div className={cardHeaderClass}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{group.title}</h3>
                    {group.description && <p className="text-xs text-base-content/50 mt-0.5">{group.description}</p>}
                  </div>
                </div>
                <div className={fieldsStackClass}>
                  {group.fields.map(({ key, label, type }) => (
                      <label key={key} className={fieldWrapClass}>
                        <span className={labelClass}>{label}</span>
                        {type === 'textarea' ? (
                          <textarea
                            {...register(key)}
                            className={textareaClass}
                            rows="3"
                          />
                        ) : (
                          <input
                            type={type || 'text'}
                            {...register(key)}
                            className={inputClass}
                          />
                        )}
                      </label>
                  ))}
                </div>
              </motion.div>
            )
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fieldGroups.length * 0.06 }}
            className={cardClass}
          >
            <div className={cardHeaderClass}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Image className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Images</h3>
                <p className="text-xs text-base-content/50 mt-0.5">Upload hero and about images</p>
              </div>
            </div>
            <div className={fieldsStackClass}>
              <div className={fieldWrapClass}>
                <span className={labelClass}>Hero Image</span>
                <UploadZone onUpload={(data) => setValue('heroImage', data.url)} />
                {watch('heroImage') && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                    <img src={watch('heroImage')} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <span className="text-xs text-base-content/50 truncate flex-1">Uploaded to Cloudinary</span>
                    <button type="button" onClick={() => setValue('heroImage', '')} className="btn btn-ghost btn-xs text-error">Remove</button>
                  </div>
                )}
              </div>
              <div className={fieldWrapClass}>
                <span className={labelClass}>About Image</span>
                <UploadZone onUpload={(data) => setValue('aboutImage', data.url)} />
                {watch('aboutImage') && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                    <img src={watch('aboutImage')} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <span className="text-xs text-base-content/50 truncate flex-1">Uploaded to Cloudinary</span>
                    <button type="button" onClick={() => setValue('aboutImage', '')} className="btn btn-ghost btn-xs text-error">Remove</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end sticky bottom-6 pt-2">
          <button
            type="submit"
            className="btn h-11 min-h-11 rounded-xl border-0 bg-primary text-white font-semibold gap-2 px-8 shadow-md shadow-primary/30 hover:brightness-110 hover:shadow-lg transition-all disabled:opacity-50"
            disabled={!isDirty || mutation.isPending}
          >
            {mutation.isPending ? <span className="loading loading-spinner loading-sm" /> : <Save className="size-4" />}
            {mutation.isPending ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
