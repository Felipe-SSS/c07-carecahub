SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema carecahub
-- -----------------------------------------------------
-- DROP SCHEMA IF EXISTS `carecahub` -- Uncomment this line if resseting the database is necessary.
CREATE SCHEMA IF NOT EXISTS `carecahub` ;
USE `carecahub` ;

-- -----------------------------------------------------
-- Table `carecahub`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` TEXT(200) NOT NULL,
  `github` VARCHAR(15) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Mentor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Mentor` (
  `id` INT NOT NULL,
  `registration` INT NOT NULL,
  `consultation_hours` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `registration_UNIQUE` (`registration` ASC) VISIBLE,
  CONSTRAINT `fk_Mentor_User1`
    FOREIGN KEY (`id`)
    REFERENCES `carecahub`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Student` (
  `id` INT NOT NULL,
  `registration` INT NOT NULL,
  `classroom` CHAR(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `registration_UNIQUE` (`registration` ASC),
  CONSTRAINT `fk_Student_User`
    FOREIGN KEY (`id`)
    REFERENCES `carecahub`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Project` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT(200) NOT NULL,
  `dependency_manager` VARCHAR(15) NOT NULL,
  `tecnologies` JSON NOT NULL,
  `repository_type` ENUM('Monorepo', 'Multirepo') NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `friendlyId` VARCHAR(30) NOT NULL,
  `project_id` INT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Group_Project1_idx` (`project_id` ASC) VISIBLE,
  UNIQUE INDEX `project_id_UNIQUE` (`project_id` ASC) VISIBLE,
  CONSTRAINT `fk_Group_Project1`
    FOREIGN KEY (`project_id`)
    REFERENCES `carecahub`.`Project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Repository`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Repository` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `github_url` VARCHAR(50) NOT NULL,
  `included_in_organization` TINYINT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Repository_Project1_idx` (`project_id` ASC) VISIBLE,
  CONSTRAINT `fk_Repository_Project1`
    FOREIGN KEY (`project_id`)
    REFERENCES `carecahub`.`Project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Ticket` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `assignee_id` INT NULL,
  `creator_id` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `description` TEXT(200) NULL,
  `due_date` DATETIME NULL,
  `column` VARCHAR(15) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Ticket_Project1_idx` (`project_id` ASC) VISIBLE,
  INDEX `fk_Ticket_User1_idx` (`creator_id` ASC) VISIBLE,
  INDEX `fk_Ticket_User2_idx` (`assignee_id` ASC) VISIBLE,
  CONSTRAINT `fk_Ticket_Project1`
    FOREIGN KEY (`project_id`)
    REFERENCES `carecahub`.`Project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ticket_User1`
    FOREIGN KEY (`creator_id`)
    REFERENCES `carecahub`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ticket_User2`
    FOREIGN KEY (`assignee_id`)
    REFERENCES `carecahub`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`GroupMember`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`GroupMember` (
  `student_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `is_leader` TINYINT NOT NULL DEFAULT 0,
  `joined_at` DATETIME NOT NULL,
  PRIMARY KEY (`student_id`, `group_id`),
  INDEX `fk_GroupMember_Group1_idx` (`group_id` ASC) VISIBLE,
  CONSTRAINT `fk_GroupMember_Student1`
    FOREIGN KEY (`student_id`)
    REFERENCES `carecahub`.`Student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_GroupMember_Group1`
    FOREIGN KEY (`group_id`)
    REFERENCES `carecahub`.`Group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `carecahub`.`Teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carecahub`.`Teacher` (
  `id` INT NOT NULL,
  `consultation_hours` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Teacher_User1`
    FOREIGN KEY (`id`)
    REFERENCES `carecahub`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;