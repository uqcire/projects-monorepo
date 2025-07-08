import { supabase } from '@/store/supabase'
import { defineStore } from 'pinia'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    contacts: [],
    loading: false,
    error: null,
  }),

  getters: {
    getContactById: (state) => (id) => {
      return state.contacts.find(contact => contact.id === id)
    },

    getContactsByTag: (state) => (tag) => {
      return state.contacts.filter(contact => contact.tags?.includes(tag))
    },
  },

  actions: {
    async fetchContacts() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.contacts = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createContact(contactData) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('contacts')
          .insert([{
            first_name: contactData.firstName,
            last_name: contactData.lastName,
            company: contactData.company,
            phone: contactData.phone,
            email: contactData.email,
            address: contactData.address,
            birthday: contactData.birthday,
            social_profiles: {
              twitter: contactData.socialProfiles?.twitter,
              facebook: contactData.socialProfiles?.facebook,
              instagram: contactData.socialProfiles?.instagram,
              wechat: contactData.socialProfiles?.wechat,
              tiktok: contactData.socialProfiles?.tiktok,
            },
            custom_fields: contactData.customFields || {},
            tags: contactData.tags || [],
            notes: contactData.notes || '',
          }])
          .select()

        if (error) throw error
        this.contacts.unshift(data[0])
        return data[0]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateContact(id, contactData) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('contacts')
          .update({
            first_name: contactData.firstName,
            last_name: contactData.lastName,
            company: contactData.company,
            phone: contactData.phone,
            email: contactData.email,
            address: contactData.address,
            birthday: contactData.birthday,
            social_profiles: {
              twitter: contactData.socialProfiles?.twitter,
              facebook: contactData.socialProfiles?.facebook,
              instagram: contactData.socialProfiles?.instagram,
              wechat: contactData.socialProfiles?.wechat,
              tiktok: contactData.socialProfiles?.tiktok,
            },
            custom_fields: contactData.customFields || {},
            tags: contactData.tags || [],
            notes: contactData.notes || '',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()

        if (error) throw error
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = data[0]
        }
        return data[0]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteContact(id) {
      this.loading = true
      try {
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('id', id)

        if (error) throw error
        this.contacts = this.contacts.filter(c => c.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addCustomField(id, fieldName, fieldValue) {
      this.loading = true
      try {
        const contact = this.getContactById(id)
        if (!contact) throw new Error('Contact not found')

        const customFields = {
          ...contact.custom_fields,
          [fieldName]: fieldValue,
        }

        const { data, error } = await supabase
          .from('contacts')
          .update({ custom_fields: customFields })
          .eq('id', id)
          .select()

        if (error) throw error
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = data[0]
        }
        return data[0]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addNote(contactId, note) {
      const contact = this.getContactById(contactId)
      if (!contact) throw new Error('Contact not found')
      const notes = Array.isArray(contact.notes) ? [...contact.notes] : []
      notes.push(note)
      const { data, error } = await supabase
        .from('contacts')
        .update({ notes })
        .eq('id', contactId)
        .select()
      if (error) throw error
      const idx = this.contacts.findIndex(c => c.id === contactId)
      if (idx !== -1) this.contacts[idx] = data[0]
      return data[0]
    },
  },
})
