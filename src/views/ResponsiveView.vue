<template>
  <div>
    <h1>Send PDF to MQTT Server</h1>
    <button @click="sendPdfToMQTT">Send PDF</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Client, Message } from 'paho-mqtt'
import pdfFile from '@/sample.pdf'

export default {
  setup() {
    const host = 'vps.qqltech.com'
    const port = 7011
    // const topic = 'directPrint/output'
    const topic = 'directPrint/convert'
    const clientId = `client-${Math.random().toString(16).substr(2, 8)}`
    const username = 'superDollar' // Ganti dengan username MQTT Anda
    const password = 'superDoll4r' // Ganti dengan password MQTT Anda

    const client = new Client(host, port, clientId)

    // Fungsi untuk menghubungkan ke MQTT server dengan opsi autentikasi
    const connectMQTT = () => {
      return new Promise((resolve, reject) => {
        client.connect({
          userName: username,
          password: password,
          onSuccess: () => {
            console.log('Connected to MQTT with authentication')
            resolve()
          },
          onFailure: (error) => {
            console.log('Failed to connect', error)
            reject(error)
          },
          useSSL: true // Pastikan SSL digunakan
        })
      })
    }

    // Fungsi untuk mengirim PDF ke MQTT server
    const sendPdfToMQTT = async () => {
      try {
        // Ambil file PDF dari folder src menggunakan URL import
        const response = await fetch(pdfFile)
        const blob = await response.blob()

        // Convert PDF blob ke base64 string
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = async () => {
          const pdfData = reader.result

          // Hubungkan ke broker MQTT
          await connectMQTT()

          const message = new Message(pdfData)
          message.destinationName = topic

          client.send(message) // Kirim pesan
          console.log('PDF sent to MQTT')
        }
      } catch (error) {
        console.error('Error sending PDF to MQTT', error)
      }
    }

    return {
      sendPdfToMQTT
    }
  }
}
</script>
