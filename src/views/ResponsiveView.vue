<template>
  <div id="app">
    <h1>MQTT Client</h1>
    <div id="status">{{ status }}</div>
    <button @click="connect">Connect</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Client } from 'paho-mqtt' // Import Paho MQTT Client

export default {
  name: 'App',
  setup() {
    const status = ref('Disconnected') // Status koneksi
    const host = 'vps.qqltech.com' // Ganti dengan host broker kamu
    const port = 7011 // Port untuk WebSocket
    const username = 'superDollar' // Ganti dengan username kamu
    const password = 'superDoll4r' // Ganti dengan password kamu
    const clientId = 'clientId_' + Math.random().toString(16).substr(2, 8) // ID unik untuk klien MQTT
    let client = null // Instance dari Paho MQTT Client

    const connect = () => {
      // Membuat instance client MQTT
      client = new Client(host, port, clientId)

      // Fungsi callback saat koneksi berhasil
      const onConnect = () => {
        console.log('Connected to MQTT broker')
        status.value = 'Connected to MQTT broker'

        // Langganan ke topik
        client.subscribe('topic/test', { qos: 0 })
        console.log('Subscribed to topic/test')
      }

      // Fungsi callback saat koneksi gagal
      const onFailure = (responseObject) => {
        console.error('Connection failed: ' + responseObject.errorMessage)
        status.value = 'Connection failed: ' + responseObject.errorMessage
      }

      // Menangani pesan yang diterima
      client.onMessageArrived = (message) => {
        console.log('Message received: ' + message.payloadString)
      }

      // Menghubungkan dengan opsi otentikasi
      client.connect({
        userName: username,
        password: password,
        onSuccess: onConnect,
        onFailure: onFailure,
        useSSL: true // Pastikan SSL digunakan
      })
    }

    return {
      status,
      connect
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  padding: 20px;
}

#status {
  margin: 20px 0;
  font-weight: bold;
}
</style>
