import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'
import { getFirestore, doc, setDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js'

const cfgStr = (typeof window !== 'undefined' && typeof window.__firebase_config !== 'undefined') ? JSON.stringify(window.__firebase_config) : '{}'
const firebaseConfig = JSON.parse(cfgStr)

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function handleRegister(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const userId = user.uid
    await setDoc(doc(db, 'users', userId), {
      name: name,
      email: email,
      agro_level: 'Iniciante',
      created_at: Timestamp.now()
    })
    return { success: true, message: 'Cadastro realizado com sucesso! Você está logado.' }
  } catch (error) {
    let errorMessage = 'Erro desconhecido ao cadastrar.'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'O email fornecido já está em uso por outra conta.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'O formato do email é inválido.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
    } else {
      errorMessage = `Erro ao cadastrar: ${error.message}`
    }
    return { success: false, message: errorMessage }
  }
}

export async function handleLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    return { success: true, message: 'Login realizado com sucesso!' }
  } catch (error) {
    let errorMessage = 'Erro desconhecido ao fazer login.'
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Email ou senha incorretos. Tente novamente.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'O formato do email é inválido.'
    } else {
      errorMessage = `Erro ao fazer login: ${error.message}`
    }
    return { success: false, message: errorMessage }
  }
}
