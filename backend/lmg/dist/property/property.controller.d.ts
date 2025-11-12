import { I18nService } from 'nestjs-i18n';
import { PropertyService } from './property.service';
import { AssetDocument } from './property.schema';
import { CreateAssetDto } from './property.dto';
export declare class PropertyController {
    private readonly propertyService;
    private readonly i18n;
    private readonly logger;
    constructor(propertyService: PropertyService, i18n: I18nService);
    create(payload: CreateAssetDto, files: Array<Express.Multer.File>, req: any, lang: string): Promise<{
        message: string;
        asset: AssetDocument;
    }>;
}
