-- Bulk Operations Feature - Phase 1 (MVP)
-- Tables for tracking bulk QR creation jobs

-- Main table for bulk operation tracking
CREATE TABLE IF NOT EXISTS bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('create', 'update', 'delete', 'export')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_items INTEGER NOT NULL DEFAULT 0,
    processed_items INTEGER NOT NULL DEFAULT 0,
    success_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    error_details JSONB DEFAULT NULL,
    file_url TEXT DEFAULT NULL,
    mapping JSONB DEFAULT NULL,
    options JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual items within a bulk operation
CREATE TABLE IF NOT EXISTS bulk_operation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulk_operation_id UUID NOT NULL REFERENCES bulk_operations(id) ON DELETE CASCADE,
    qr_id UUID REFERENCES qrs(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    error_message TEXT DEFAULT NULL,
    input_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_bulk_operations_user_id ON bulk_operations(user_id);
CREATE INDEX idx_bulk_operations_status ON bulk_operations(status);
CREATE INDEX idx_bulk_operations_created_at ON bulk_operations(created_at DESC);
CREATE INDEX idx_bulk_operation_items_bulk_op_id ON bulk_operation_items(bulk_operation_id);
CREATE INDEX idx_bulk_operation_items_status ON bulk_operation_items(status);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bulk_operations_updated_at
    BEFORE UPDATE ON bulk_operations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS policies (disabled by default for MVP)
ALTER TABLE bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_operation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own bulk operations"
    ON bulk_operations
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access items from their own bulk operations"
    ON bulk_operation_items
    USING (
        EXISTS (
            SELECT 1 FROM bulk_operations
            WHERE bulk_operations.id = bulk_operation_items.bulk_operation_id
            AND bulk_operations.user_id = auth.uid()
        )
    );

COMMENT ON TABLE bulk_operations IS 'Tracks bulk QR code operations';
COMMENT ON TABLE bulk_operation_items IS 'Individual items within a bulk operation';
