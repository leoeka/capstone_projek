/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addColumn('users_cvs', {
        extracted_text: { 
            type: 'text',
            notNull: false
        },
        ai_result: { 
            type: 'jsonb',
            notNull: false
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropColumn('users_cvs', [
        'extracted_text',
        'ai_result'
    ]);
};
