const fs = require('fs');
const rules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                   (request.auth.token.email == 'darunima20@gmail.com' || 
                    request.auth.token.email == 'rahulshome828@gmail.com');
    }
  }
}`;
fs.writeFileSync('storage.rules', rules, 'utf8');
console.log('storage.rules created with utf8');
