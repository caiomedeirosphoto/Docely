// Configuração do docely. Para ligar o Firebase de verdade, troque "COLE_AQUI"
// pelos dados do projeto (Console do Firebase > Configurações do projeto > Seus apps).
export const CONFIG = {
  firebase: {
    apiKey: "AIzaSyCvCZNm1Q279PRcdNqP2zWAKozFKkfjGX0",
    authDomain: "docely-4f675.firebaseapp.com",
    projectId: "docely-4f675",
    storageBucket: "docely-4f675.firebasestorage.app",
    messagingSenderId: "112771933207",
    appId: "1:112771933207:web:267662748df398ccaf2852"
  },
  // Quem pode abrir o painel (e-mails das contas de vocês)
  admins: ["caiodanielmedeiros96@gmail.com", "miriellysantosdc@gmail.com"],
  // Pix
  pixKey: "+5571996936089",
  pixName: "DOCELY",
  pixCity: "FLORIANOPOLIS",
  pixHours: 24,
  // WhatsApp que recebe os comprovantes (só números, com 55 + DDD)
  whatsapp: "5548984120288",
  // Horário limite para entrega no próximo dia útil
  cutoff: { h: 22, m: 30 }
};
