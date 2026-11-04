rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /sales/{saleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.createdBy == request.auth.uid;
      allow delete: if request.auth != null;
      allow update: if false;
    }
  }
}