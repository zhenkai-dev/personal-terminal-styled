-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` TEXT NULL,
    `first_visit_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_visit_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_commands` INTEGER NOT NULL DEFAULT 0,
    `timezone` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,

    UNIQUE INDEX `users_session_id_key`(`session_id`),
    INDEX `users_session_id_idx`(`session_id`),
    INDEX `users_last_visit_at_idx`(`last_visit_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(191) NULL,
    `response_type` ENUM('STATIC', 'DYNAMIC', 'FILE_DOWNLOAD') NOT NULL DEFAULT 'STATIC',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `commands_name_key`(`name`),
    INDEX `commands_name_idx`(`name`),
    INDEX `commands_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `command_executions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NULL,
    `command_name` VARCHAR(191) NOT NULL,
    `execution_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `response_time_ms` INTEGER NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` TEXT NULL,
    `success` BOOLEAN NOT NULL DEFAULT true,
    `error_message` TEXT NULL,

    INDEX `command_executions_user_id_idx`(`user_id`),
    INDEX `command_executions_command_name_idx`(`command_name`),
    INDEX `command_executions_execution_time_idx`(`execution_time`),
    INDEX `command_executions_success_idx`(`success`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `command_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `command_name` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `content` TEXT NOT NULL,
    `content_type` VARCHAR(191) NOT NULL DEFAULT 'text/plain',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `command_responses_command_name_idx`(`command_name`),
    INDEX `command_responses_is_active_idx`(`is_active`),
    UNIQUE INDEX `command_responses_command_name_version_key`(`command_name`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_downloads` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_type` VARCHAR(191) NOT NULL,
    `download_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ip_address` VARCHAR(191) NULL,
    `user_agent` TEXT NULL,
    `success` BOOLEAN NOT NULL DEFAULT true,

    INDEX `file_downloads_user_id_idx`(`user_id`),
    INDEX `file_downloads_file_type_idx`(`file_type`),
    INDEX `file_downloads_download_time_idx`(`download_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics_daily` (
    `date` DATETIME(3) NOT NULL,
    `unique_visitors` INTEGER NOT NULL DEFAULT 0,
    `total_commands` INTEGER NOT NULL DEFAULT 0,
    `total_downloads` INTEGER NOT NULL DEFAULT 0,
    `most_popular_command` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `analytics_daily_date_idx`(`date`),
    PRIMARY KEY (`date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `command_executions` ADD CONSTRAINT `command_executions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `command_executions` ADD CONSTRAINT `command_executions_command_name_fkey` FOREIGN KEY (`command_name`) REFERENCES `commands`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `command_responses` ADD CONSTRAINT `command_responses_command_name_fkey` FOREIGN KEY (`command_name`) REFERENCES `commands`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file_downloads` ADD CONSTRAINT `file_downloads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
