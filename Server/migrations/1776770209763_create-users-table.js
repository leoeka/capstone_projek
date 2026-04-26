/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.createTable('users', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar(255)', notNull: true },
        email: { type: 'varchar(255)', notNull: true, unique: true },
        telepon: { type: 'varchar(20)', notNull: true },
        role: { type: 'varchar(255)' },
        password: { type: 'varchar(255)', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable('users')
};
