<template>
  <div>
    <h1>Send PDF to MQTT Server</h1>
    <button @click="sendPdfToMQTT">Send PDF</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Client, Message } from 'paho-mqtt'
// Mengimpor PDF sebagai base64
import pdfFileBase64 from '@/sample.pdf?raw' // Misalnya file PDF ada di folder assets

export default {
  setup() {
    const host = 'vps.qqltech.com'
    const port = 7011
    const topic = 'directPrint/convert'
    const clientId = `client-${Math.random().toString(16).substr(2, 8)}`
    const username = 'superDollar' // Ganti dengan username MQTT Anda
    const password = 'superDoll4r' // Ganti dengan password MQTT Anda

    const client = new Client(host, port, clientId)
    let isConnected = false // Flag untuk memeriksa status koneksi

    // Fungsi untuk menghubungkan ke MQTT server dengan opsi autentikasi
    const connectMQTT = () => {
      return new Promise((resolve, reject) => {
        client.connect({
          userName: username,
          password: password,
          onSuccess: () => {
            console.log('Connected to MQTT with authentication')
            isConnected = true // Tandai sudah terhubung
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
        if (!isConnected) {
          await connectMQTT() // Pastikan terhubung jika belum
        }

        // Menggunakan pdfFileBase64 yang sudah di-import sebagai base64
        const pdfData = pdfFileBase64

        const message = new Message(pdfData)
        message.destinationName = topic

        client.send(message) // Kirim pesan PDF
        console.log('PDF sent to MQTT')
      } catch (error) {
        console.error('Error sending PDF to MQTT', error)
      }
    }

    // Hubungkan ke MQTT saat halaman dimuat
    onMounted(() => {
      connectMQTT().catch((error) => {
        console.error('Failed to connect to MQTT on page load', error)
      })
    })

    return {
      sendPdfToMQTT
    }
  }
}
</script>
