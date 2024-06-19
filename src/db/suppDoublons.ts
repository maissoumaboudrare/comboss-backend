import { db } from './db';

async function supprimerDoublonsUsers() {
    try {
        // Supprime les doublons des utilisateurs
        await db.delete('users')
                 .where('user_id')
                 .in(db.select('user_id')
                        .from(db.select('user_id', 'ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS row_num')
                                 .from('users')
                                 .as('duplicates')
                        )
                        .where('row_num', '>', 1)
                 )
                 .execute();

        console.log('Les doublons des utilisateurs ont été supprimés avec succès.');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression des doublons des utilisateurs :', error);
    }
}

supprimerDoublonsUsers();