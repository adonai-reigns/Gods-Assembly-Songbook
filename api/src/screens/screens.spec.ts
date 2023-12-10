import { Test, TestingModule } from '@nestjs/testing';
import { Screens } from './screens.providers';

describe('Screens', () => {
    let provider: Screens;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Screens],
        }).compile();

        provider = module.get<Screens>(Screens);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
