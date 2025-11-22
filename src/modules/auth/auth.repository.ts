import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getDb } from "../../config/db";

export class AuthRepository {
  private db = getDb();

  async findByEmail(email: string) {
    const [rows] = await this.db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  }

  async createUser(name: string, email: string, passwordHash: string) {
    const [result] = await this.db.query<ResultSetHeader>(
      `
      INSERT INTO users (name, email, password_hash, is_active, is_verified, two_fa_enabled)
      VALUES (?, ?, ?, 1, 0, 0)
      `,
      [name, email, passwordHash]
    );
    return result.insertId;
  }

  async assignDefaultRole(userId: number) {
    await this.db.query(`INSERT INTO user_roles (user_id, role_id) VALUES (?, 3)`, [userId]);
  }
}

export const authRepository = new AuthRepository();
