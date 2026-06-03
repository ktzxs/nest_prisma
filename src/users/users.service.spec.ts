import { DatabaseService } from '../database/database.service';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update.user.dto';
import { PayLoadTokenDto } from '../auth/dto/payload-token.dto';

describe('UsersService Testing', () => {
  let usersService: UsersService;
  let databaService: DatabaseService;
  let hashingService: HashingServiceProtocol;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Joao doe',
                email: 'joaodoe@gmail.com',
              }),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    databaService = module.get<DatabaseService>(DatabaseService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });

  it('should be defined users service', () => {
    expect(usersService).toBeDefined();
  });

  describe('Create a user', () => {
    it('Shoud create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'joao doe',
        email: 'joaodoes@gmail.com',
        password: 'Mn@123gh',
      };

      jest
        .spyOn(hashingService, 'hash')
        .mockResolvedValue('HASH_MOCK_PASSWORD');

      const result = await usersService.create(createUserDto);
      expect(hashingService.hash).toHaveBeenCalled();
      expect(databaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          passwordHash: 'HASH_MOCK_PASSWORD',
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      expect(result).toEqual({
        id: 1,
        name: 'Joao doe',         
        email: 'joaodoe@gmail.com', 
      });
    });

    it('should throw an error when create user fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'joao doe',
        email: 'joaodoe@gmail.com',
        password: 'Mn@123gh',
      };
      jest
        .spyOn(hashingService, 'hash')
        .mockResolvedValue('HASH_MOCK_PASSWORD');
      jest
        .spyOn(databaService.user, 'create')
        .mockRejectedValue(new Error('Error'));

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        new HttpException(
          'Failed to create user', 
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(databaService.user.create).toHaveBeenCalledWith({ 
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: 'HASH_MOCK_PASSWORD', 
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    });
  });

  describe('Find one user', () => { 
    it('should find a user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'joao',
        email: 'joao@gmail.com',
        avatar: null,
        tasks: [],             
        passwordHash: 'HASH_MOCK_PASSWORD',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(databaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await usersService.findOne(1);

      expect(databaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          tasks: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when find user fails', async () => {
      jest.spyOn(databaService.user, 'findUnique').mockResolvedValue(null);

      await expect(usersService.findOne(1)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update user', () => {
    it('should throw an error when user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'joao doe updated',
        email: 'joaodoe@gmail.com',
        password: 'Mn@123gh',
      };
      const tokenPayload: PayLoadTokenDto = {
        sub: 1,
        aud: '',
        email: 'joodoe@gmail.com',
        exp: 123,
        iat: 123,
        iss: '',
      };

      jest.spyOn(databaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        usersService.update(1, updateUserDto, tokenPayload),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.BAD_REQUEST),
      );
    });
  });
});