import { BlogsQueryRepository } from "../../modules/blogs/infrastructure/repositories/blogs-query.repository";
import { BlogsCommandRepository } from "../../modules/blogs/infrastructure/repositories/blogs-command.repository";
import { PostsQueryRepository } from "../../modules/posts/infrastructure/repositories/posts-query.repository";
import { PostsCommandRepository } from "../../modules/posts/infrastructure/repositories/posts-command.repository";
import {UsersQueryRepository} from "../../modules/users/domain/infrastructures/repositories/users-query.repository";
import {UsersCommandRepository} from "../../modules/users/domain/infrastructures/repositories/users-command.repository";
import {TokenCommandRepository} from "../../modules/auth/infrastructure/repositories/token-command.repository";

export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsCommandRepository = new BlogsCommandRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const postsCommandRepository = new PostsCommandRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const usersCommandRepository = new UsersCommandRepository();
export const tokenCommandRepository = new TokenCommandRepository();