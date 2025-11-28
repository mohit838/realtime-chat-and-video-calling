import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getDb } from "../../config/db.js";

interface RoleRow extends RowDataPacket {
  name: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

export class AuthRepository {
  private db = getDb();

  async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await this.db.query<UserRow[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [
      email,
    ]);
    return rows[0] || null;
  }

  async findById(id: number): Promise<UserRow | null> {
    const [rows] = await this.db.query<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    return rows[0] || null;
  }

  async createUser(name: string, email: string, passwordHash: string) {
    const [result] = await this.db.query<ResultSetHeader>(
      `
      INSERT INTO users (name, email, password_hash, is_active, otp_verified, two_factor_enabled)
      VALUES (?, ?, ?, 1, 0, 0)
      `,
      [name, email, passwordHash]
    );
    return result.insertId;
  }

  async assignDefaultRole(userId: number) {
    await this.db.query(`INSERT INTO user_roles (user_id, role_id) VALUES (?, 3)`, [userId]);
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const [rows] = await this.db.query<RoleRow[]>(
      `SELECT r.name
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = ?`,
      [userId]
    );
    return rows.map((row) => row.name);
  }
}

export const authRepository = new AuthRepository();
