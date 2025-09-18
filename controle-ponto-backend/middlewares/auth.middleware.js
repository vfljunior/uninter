const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido' });
    }
    
    req.user = user;
    next();
  });
};

/*
Exemplo de uso com Firebase:

javascript
Copy
const { db } = require('../config/firebase');

class FuncionarioFirebase {
  static async criar(funcionario) {
    const docRef = await db.collection('funcionarios').add(funcionario);
    return { id: docRef.id, ...funcionario };
  }

  static async listar() {
    const snapshot = await db.collection('funcionarios').where('ativo', '==', true).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}


*/