/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    content: { type: 'text', notNull: true },
    user_id: { type: 'uuid', notNull: true },
    is_public: { type: 'boolean', notNull: true, default: false },
    metadata: { type: 'jsonb', default: '{}' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add indexes
  pgm.createIndex('documents', 'user_id');
  pgm.createIndex('documents', 'is_public');
  pgm.createIndex('documents', ['title'], { method: 'GIN', operator: 'gin_trgm_ops' });
  pgm.createIndex('documents', ['content'], { method: 'GIN', operator: 'gin_trgm_ops' });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
}; 