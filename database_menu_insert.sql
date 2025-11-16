-- 菜单数据插入脚本
-- 表名: system_menu
-- 执行前请确保表结构已创建

-- 清空现有菜单数据（可选）
-- DELETE FROM system_menu;

-- 插入默认菜单数据
INSERT INTO `system_menu` (`name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_at`, `updater`, `update_at`) VALUES
-- 一级菜单
('首页', 'home:view', 1, 1, 0, '/home', 'House', 'home/index', 'home', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('系统管理', 'system:menu:list', 1, 2, 0, '/system', 'Setting', 'system/index', 'system', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('字典管理', 'system:dict:list', 1, 3, 0, '/dict', 'CollectionTag', 'dict/index', 'dict', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('监控运维', 'monitor:view', 1, 4, 0, '/monitor', 'Monitor', 'monitor/index', 'monitor', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),

-- 二级菜单 - 系统管理
('用户管理', 'system:user:list', 2, 1, 2, '/user', 'User', 'user/index', 'user', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('部门管理', 'system:dept:list', 2, 2, 2, '/dept', 'Collection', 'dept/index', 'dept', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('角色管理', 'system:role:list', 2, 3, 2, '/role', 'Avatar', 'role/index', 'role', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('菜单管理', 'system:menu:list', 2, 4, 2, '/menu', 'List', 'system/menu/index', 'menu', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),

-- 二级菜单 - 字典管理
('字典类型', 'system:dictType:list', 2, 1, 4, '/dict/type', 'CollectionTag', 'dict/type/index', 'dict-type', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('字典数据', 'system:dictData:list', 2, 2, 4, '/dict/data', 'List', 'dict/data/index', 'dict-data', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),

-- 二级菜单 - 监控运维
('主机管理', 'host:list', 2, 1, 5, '/hosts', 'Monitor', 'hosts/index', 'hosts', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),
('AI助手', 'ai:view', 2, 2, 5, '/ai', 'MagicStick', 'ai/index', 'ai', 0, 1, 1, 1, 'system', NOW(), 'system', NOW()),

-- 按钮权限（如果需要）
('新增用户', 'system:user:add', 3, 1, 5, '', '', '', '', 0, 1, 0, 0, 'system', NOW(), 'system', NOW()),
('编辑用户', 'system:user:edit', 3, 2, 5, '', '', '', '', 0, 1, 0, 0, 'system', NOW(), 'system', NOW()),
('删除用户', 'system:user:delete', 3, 3, 5, '', '', '', '', 0, 1, 0, 0, 'system', NOW(), 'system', NOW()),
('导出用户', 'system:user:export', 3, 4, 5, '', '', '', '', 0, 1, 0, 0, 'system', NOW(), 'system', NOW());

-- 如果您的数据库不支持NOW()函数，请使用对应的时间函数
-- MySQL: NOW()
-- PostgreSQL: NOW()
-- SQL Server: GETDATE()
-- SQLite: datetime('now')

-- 如果您的数据库字段名不同，请根据实际表结构调整
-- 例如：如果字段名是snake_case格式，请相应调整

-- 验证插入结果
-- SELECT id, name, parent_id, type, sort FROM system_menu ORDER BY parent_id, sort;