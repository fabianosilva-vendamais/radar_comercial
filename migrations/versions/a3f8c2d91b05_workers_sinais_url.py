"""workers: tabela rastreios + url/status em sinais

Revision ID: a3f8c2d91b05
Revises: ddc735870db4
Create Date: 2026-06-22 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'a3f8c2d91b05'
down_revision = 'ddc735870db4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'rastreios',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('escopo', sa.String(length=16), nullable=True),
        sa.Column('empresa_id', sa.String(length=64), nullable=True),
        sa.Column('status', sa.String(length=16), nullable=False, server_default='na_fila'),
        sa.Column('progresso', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total', sa.Integer(), nullable=True),
        sa.Column('processadas', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('erro_msg', sa.Text(), nullable=True),
        sa.Column('iniciado_em', sa.DateTime(), nullable=True),
        sa.Column('terminado_em', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )

    with op.batch_alter_table('sinais', schema=None) as batch_op:
        batch_op.add_column(sa.Column('url', sa.Text(), nullable=True))
        batch_op.add_column(
            sa.Column('status', sa.String(length=16), nullable=False, server_default='a_verificar')
        )


def downgrade():
    with op.batch_alter_table('sinais', schema=None) as batch_op:
        batch_op.drop_column('status')
        batch_op.drop_column('url')

    op.drop_table('rastreios')
